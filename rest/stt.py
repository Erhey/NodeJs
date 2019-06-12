#import
import boto3
import os #system
import re #regex
from ibm_watson import SpeechToTextV1
import json

# recup value 
username_env = os.environ.get("USERNAME", "6d6305e3-1223-41e1-99ee-f11fc2f61ed3")
password_env = os.environ.get("PASSWORD", "Ru3pEtpYyDXL")
customization = os.environ.get("CUSTOMIZATION", "dummy")
base_url = os.environ.get("BASE_URL", "dummy")
apiKey = os.environ.get("API_KEY", "dummy")
env = os.environ['ENVIRONMENT']
bucket_name = os.environ['BUCKET_NAME']

# sttConfig を設定
speech_to_text = SpeechToTextV1(
    iam_apikey=base_url,
    url=apiKey
)

# Le fichier python
#################################################################
# Etape 1 : 2.1 Generation D'un fichier id
# sample name : whole_v(x+1)_id
# contents : 
# username=6d6305e3-1223-41e1-99ee-f11fc2f61ed3 <※1>
# password=Ru3pEtpYyDXL <※1>
# customization=     <Firstly empty>
# a_customization=   <Firstly empty>


# <※1> Il faut savoir ou et comment on obtient ces infos
# Ces informations sont donnees de base 固定情報


def main ():
    # Generate model from word list
    modeltxt = generateModel()
    # Check if model status is ready
    if(checkModelStatus(json.loads(modeltxt.read()))):
        # delete words with error
        deleteBadWords()
        # run training / tuning
        train()
        # try audio training after tuning
        audio_train()
        # Generate next langage version file 
        genNextIdVersionFile()


def genNextIdVersionFile ():
    curFilesName = []
    curVersion = 0
    for fileName in os.listdir("./"):
        x = re.search("^[\\w]+_v([0-9]+)[\\w_]+$", fileName)
        if x:
            curFilesName.append(x.group())
            curVersion = max(int(re.search("([0-9]+)", fileName).group()),curVersion)
    curVersion = curVersion + 1
    for file in curFilesName:
        f = open("./stt/" + re.sub("([0-9]+)", str(curVersion), file), "a")
        ## ここにユーザーネームとパスワードを書く
        f.write("username=" + username_env + "\n")
        f.write("password=" + password_env + "\n")
        f.write("customization=\n")
        f.write("a_customization=")
        f.close()




#################################################################
# Etape 2 : Creation du fichier de customization : model.txt 
# (pas en local. On le post d'abords sur le site pour ensuite le recuperer)
# $ cd /c/voice-gateway/stt/word_material
# $ ./stt_word_create.sh whole_v1

# os.chdir("./stt") # 別のディレクトリに移動する必要があれば利用する
# os.popen('test.sh test').read()
def generateModel ():
    # Create Model using STT api
    language_model = speech_to_text.create_language_model(
        'First example language model',
        'ja-JP_BroadbandModel',
        description='First custom language model example'
    ).get_result()
    model_txt = open("./model.txt", "w")
    model_txt.write(json.dumps(language_model, indent=2))
    model_txt.close()
    return language_model


"""

os.popen('stt_word_create.sh whole_v' + curVersion).read()
subprocess.Popen(["test.sh"], shell=True)

"""



#################################################################
# Etape 3 : Recuperation du fichier enregistrer sur le serveur : model.txt 
# $ ./stt_word_get_model.sh whole_v1 > model.txt
"""
os.popen('stt_word_get_model.sh > model.txt').read()

要らないかも
"""


#################################################################
# Etape 4 : Verification de L'etat de model.txt
# A)  (Le status doit etre ready. Il faut voir comment recuperer cet id et de check sa value)
# B)  En parallele, recuperer l'id de customization et l'inserer dans le fichier creer a l'etape 1

# Dummy言語番号：c8434cb2-8874-4a1c-8e4b-8a8204eedb50
def checkModelStatus(modelObj):
    status = False
    for custoObj in modelObj["customizations"]:
        if custoObj["customization_id"] == customization and custoObj["status"] == "ready":
            status = True
            return True

    # going out of for loop means that model was not ready to be tested !
    f = open("./debug/error.log" , "a")
    ## ここにユーザーネームとパスワードを書く
    f.write("model.txt is not ready to be tested\n")
    f.close()
    return False




# {"customizations": [
# ...
#    {
#       "owner": "d262fc50-86c5-4fe5-bc8b-18494ae413ea",
#       "base_model_name": "ja-JP_NarrowbandModel",
#       "customization_id": "c8434cb2-8874-4a1c-8e4b-8a8204eedb50",
#       "dialect": "ja-JP",
#       "versions": ["ja-JP_NarrowbandModel.v10-17112016.17112016"],
#       "created": "2018-08-16T05:14:38.339Z",
#       "name": "whole_v4 model",
#       "description": "whole_v4 custom language model",
#       "progress": 0,
#       "language": "ja-JP",
#       "status": "ready"
#    }
# ...
# ]



#################################################################
# Etape 5 : Lancer le Training
# $ cd /c/voice-gateway/stt/word_material
# $ ./stt_word_train.sh ＜モデル略称＞_v＜バージョン＞
"""
speech_to_text.train_language_model(customization)
"""
###########################   質問    ###########################   
#　トレーニング実行時点　：
#       次のコマンドを実行で繰り返すか。
#           →　　$ cd /c/voice-gateway/stt/word_material
#           →　　$ ./stt_delete_word.sh ＜モデル略称＞_v＜バージョン＞ ＜URLエンコード済みword＞
# "words" :[
#     {
#         "display_as": "ー",
#         "sounds_like": [""],
#         "count": 318,
#         "source": ["whole"],
#         "error": [{"": "Unable to create sounds-like."}],
#         "word": "ー"
#     },
# ]
def deleteBadWords(modelObj):
    import urllib.parse
    urlEncodedWord = ""
    errorWords = []
    for word in modelObj["words"]:
        if word["error"] is not None:
            urlEncodedWord = urllib.parse.quote(word["display_as"])
            speech_to_text.delete_word(customization,urlEncodedWord)
            errorWords.append(word)



def train():
    speech_to_text.train_language_model(customization)

#################################################################
# Etape 6  : Quand le training a finalement ete creer on test l'application et on observe le resultat.
# $ cd /c/voice-gateway/stt/test_material
# $ ./stt_voice_test_wav.sh＜モデル略称＞_v＜バージョン＞


def audio_train():
    speech_to_text.train_acoustic_model(customization)

"""


os.popen('stt_voice_test_wav.sh whole_v' + curVersion + ' ' + urlEncodedWord).read()




"""

print(__name__)

if __name__ == "__main__":
    print("Mock test")
    # main()