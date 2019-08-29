const logger = require('link_logger')

const link_models = require('link_models')
module.exports = exec = async (configName, sql, args, callback) => {
    const mysqlConnection = link_models.getMysqlConnection(configName)
    let result = {}
    try {
            await mysqlConnection.query(sql, args, (err, result) => {
                if (err) {
                    logger.error("Mysql error occured!" + err)
                    result.status = 409
                    result.message = "Mysql error occured!"
                } else {
                    logger.debug(result)
                    result.status = 201
                    result.result = result
                }
                callback(result)
        })
    } catch (e) {
        logger.error("Unexpected Mysql error occured! Error : " + e)
        result.status = 410
        result.message = "Unexpected Mysql error occured!"
        callback(result)
    }
}