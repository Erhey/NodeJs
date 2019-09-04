const logger = require('link_logger')

const {
    StatusError_200
    ,StatusError_500
    ,StatusError_502
} = require('link_http_code')


const link_models = require('link_models')

/**
 * Execute Sql query and retrieved the data without modifications
 * 
 * Sql query could be executed as a simple request or a prepared request
 */
module.exports.exec = async (configName, sql, args, callback) => {
    try {
        // Get Mysql connection with all configuration presetted
        const mysqlConnection = link_models.getMysqlConnection(configName)
        let result = {}
            // Execute Request
            await mysqlConnection.query(sql, args, (err, rows) => {
                if (err) {
                    logger.error('Mysql error occured!' + err)
                    result = new StatusError_502('Mysql error occured!')
                } else {
                    logger.debug(`rows found! rows : ${rows}`)
                    result = new StatusError_200()
                    result.rows = rows
                }
                callback(result)
        })
    } catch (e) {
        logger.error('Unexpected Server error! Error : ' + e)
        result = new StatusError_500()
        callback(result)
    }
}