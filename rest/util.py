import boto3 
from boto3.dynamodb.conditions import Key, Attr
import logging
import os
import sys
from time import sleep
from datetime import datetime, timezone
from watson_developer_cloud import AssistantV1

SSM_CLIENT = boto3.client('ssm')

def get_logger(name):
    """
    指定した名称のロガーを返します.
    """
    logger = logging.getLogger(name)
    logger.setLevel(_get_log_level())
    logger.addHandler(_create_log_handler())
    return logger

class AwsBatchLoggerFilter(logging.Filter):
    def filter(self, record):
        record.aws_batch_job_id = get_job_id()
        return True

def _get_log_level(default=logging.INFO):
    level_name = os.environ.get('LOG_LEVEL')
    level = logging.getLevelName(level_name)
    if not isinstance(level, int):
        level = default
    return level

def _create_log_handler():
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        '\t'.join([
            '[%(levelname)s]',
            '%(asctime)s.%(msecs)dZ',
            '%(aws_batch_job_id)s',
            '%(filename)s',
            '%(funcName)s',
            '%(lineno)d',
            '%(message)s',
        ]) + '\n',
        '%Y-%m-%dT%H:%M:%S'
    )
    handler.setFormatter(formatter)
    handler.addFilter(AwsBatchLoggerFilter())
    return handler

def _get_assistant_param(env_name, param_name):
    name = f'/{env_name}.assistant-helper-api.app/assistant/{param_name}'
    logger.debug('ssm get_parameter name: %s', name)

    response = SSM_CLIENT.get_parameter(
        Name=name,
        WithDecryption=True
    )
    logger.debug('ssm get_parameter response: %s', response)
    return response['Parameter']['Value']

# https://docs.aws.amazon.com/ja_jp/batch/latest/userguide/job_env_vars.html
def get_job_id():
    """
    AWS BatchジョブID文字列を返します.
    AWS Batch環境以外で動作している場合は、`__unknown__` を返します.
    """
    return os.environ.get('AWS_BATCH_JOB_ID', '__unknown__')

def get_assistant_auth(env_name):
    """
    Watson Assistantの認証情報を返します.

    以下のように、`AssistantV1` へのパラメータとして直接使用することができます.

        assistant_params = get_assistant_auth('dev')
        assistant = AssistantV1(**assistant_params)
    """
    return {
        'version': '2019-02-28',
        'url': 'https://gateway-tok.watsonplatform.net/assistant/api',
        'username': _get_assistant_param(env_name, 'username'),
        'password': _get_assistant_param(env_name, 'password')
    }

def connect_s3(bucket_name):
    s3 = boto3.resource('s3')
    return s3.Bucket(bucket_name)

def get_csv(file_path, bucket_name):
    s3_bucket = connect_s3(bucket_name)
    csv_obj = s3_bucket.Object(file_path)
    csv_data = csv_obj.get()['Body'].read().decode('utf-8')
    csv_array = csv_data.splitlines()
    array = []
    for csv in csv_array:
        intent, example = csv.split(',', 1)
        array.append([intent, example])
    return array

def format_check(array):
    for row in array:
        if len(row) != 2 and '' in row:
            raise Exception('csv format error')

def put_tsv(file_path, bucket_name, put_data):
    tsv_data = ''
    for data in put_data:
        tsv_data += ('\t'.join(data) + '\n')

    s3_bucket = connect_s3(bucket_name)
    csv_put_obj = s3_bucket.Object(file_path)
    response = csv_put_obj.put(
        Body=tsv_data.encode('utf-8'),
        ContentEncoding='utf-8',
        ContentType='text/csv'
    )

def create_assistant_workspace(assistant, learning_data, id_name):
    logger.info('Create workspace')
    intents = []
    examples = []
    for data in learning_data.items():
        intent, examples = data
        intents.append({'intent': intent, 'examples':[{"text":example} for example in examples]})

    response = assistant.create_workspace(
        name='Cross validation test : ' + id_name,
        description='Cross validation test',
        language='ja',
        intents=intents,
        metadata={}
    ).get_result()
    logger.info('workspace_id : %s', response['workspace_id'])
    return response['workspace_id']

def upload_workspace_id(env, id_name, workspace_id):
    logger.info('upload workspace id')
    now = datetime.now(timezone.utc)
    dynamodb = connect_db()
    table= dynamodb.Table(env + '_assistant_test_list')
    query_response = table.update_item(
        Key={
            'test_id': int(id_name)
        },
        UpdateExpression='set #workspace_id = :workspace_id, #updated_at = :updated_at',
        ExpressionAttributeNames={
            '#workspace_id': 'workspace_id',
            '#updated_at': 'updated_at'
        },
        ExpressionAttributeValues={
            ':workspace_id': workspace_id,
            ':updated_at': _format_time(now)
        }
    )
    logger.info('query_response : %s', query_response)


def delete_workspace(assistant, test_workspace_id):
    logger.info('Delete workspace')
    response_delete_workspace = assistant.delete_workspace(
        workspace_id=test_workspace_id
    )

def check_remain_workspace(assistant, test_workspace_id):
    respose_remain_workspace = assistant.get_workspace(
        workspace_id=test_workspace_id
    ).get_result()
    logger.info('respose_remain_workspace : %s', respose_remain_workspace)
    delete_workspace(assistant, test_workspace_id)

def get_workspace_id(env, id_name):
    logger.info('get workspace id')
    dynamodb = connect_db()
    table= dynamodb.Table(env + '_assistant_test_list')
    query_response = table.query(
        KeyConditionExpression=Key('test_id').eq(int(id_name)),
        Limit=1
    )
    logger.info('query_response : %s', query_response)
    if len(query_response['Items']) > 0:
        logger.info(query_response['Items'])
        if 'status' in query_response['Items'][0] and query_response['Items'][0]['status'] == 'Cancel':
            logger.info('workspace_id : %s', query_response['Items'][0]['workspace_id'])
            return query_response['Items'][0]['workspace_id']
    raise Exception('No workspace_id')

def split_list(list, n):
    list_size = len(list)
    a = list_size // n
    b = list_size % n
    return [list[i*a + (i if i < b else b):(i + 1)*a + (i+1 if i < b else b)] for i in range(n)]

def connect_db():
    logger.info('connect_db')
    return_obj = boto3.resource('dynamodb')
    return return_obj

def upload_progress(env, id_name, status, completion_progress):
    logger.info('upload progress')
    now = datetime.now(timezone.utc)
    dynamodb = connect_db()
    table= dynamodb.Table(env + '_assistant_test_list')
    query_response = table.update_item(
        Key={
            'test_id': int(id_name)
        },
        UpdateExpression='set #status = :status, #completion_progress = :completion_progress, #updated_at = :updated_at',
        ExpressionAttributeNames={
            '#status': 'status',
            '#completion_progress': 'completion_progress',
            '#updated_at': 'updated_at'
        },
        ExpressionAttributeValues={
            ':status': status,
            ':completion_progress': completion_progress,
            ':updated_at': _format_time(now)
        }
    )
    logger.info('query_response : %s', query_response)

def _format_time(datetime_obj, format='%Y-%m-%dT%H:%M:%S.%f%z'):
    datetime_utc = datetime_obj.astimezone(timezone.utc)
    return datetime_utc.strftime(format)

def watson_message(assistant, row, workspace_id, loop_count, sleep_time):
    try:
        intent, key = row
        watson_response = assistant.message(
            workspace_id=workspace_id,
            input={ 'text': key },
            context={},
            alternate_intents=True
        ).get_result()
        result = [key, intent]
        for intent in watson_response['intents']:
            result.append(intent['intent'])
            result.append(str(intent['confidence']))
        return result
    except:
        if loop_count > 0:
            logger.info('try again')
            sleep(sleep_time)
            loop_count -= 1
            sleep_time += 1
            return watson_message(assistant, row, workspace_id, loop_count, sleep_time)
        raise Exception('watson error')


def get_workspace_status(assistant, workspace_id):
    respose = assistant.get_workspace(
        workspace_id=workspace_id
    ).get_result()
    logger.info(respose)
    if 'status' in respose:
        if respose['status'] == 'Available':
            return True
    return False

def wait_active_workspace(assistant, workspace_id):
    logger.info('wait active workspace')
    for _ in range(60):
        sleep(30)
        active_workspace = get_workspace_status(assistant, workspace_id)
        if active_workspace:
            return
    raise Exception('workspace active time out')

def create_learning_data(data, learning_data=None):
    """インテントと例文のペアを、学習データ形式に変換します.

    学習データはキーがインテント、値が例文の配列という形式の dict です.
    初期データ learning_data が指定された場合、その中に追加登録し、learning_data を返します.
    learning_data が省略された場合、データが登録された新しい dict を返します.

    Args:
        data (list): (インテント, 例文) というタプルの配列
        learning_data (dict, optional): 初期データとして使用する dict.

    Returns:
        dict: data の内容が追加された学習データ.
    """
    if learning_data is None:
        learning_data = {}
    for row in data:
        if row[0] in learning_data:
            learning_data[row[0]].append(row[1])
        else:
            learning_data[row[0]] = [row[1]]
    return learning_data

class DeleteErrorException(Exception):
    pass

logger = get_logger(__name__)