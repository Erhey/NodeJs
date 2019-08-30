const logger = require('link_logger')

const link_models = require('link_models')
module.exports.exec = async (configName, sql, args, callback) => {
    try {
        logger.info(`received Mysql query for
            'configuration' : ${configName},
            'sql' : ${sql},
            'arguments' : ${args}`)
        const mysqlConnection = link_models.getMysqlConnection(configName)
        let result = {}
            await mysqlConnection.query(sql, args, (err, rows) => {
                if (err) {
                    logger.error("Mysql error occured!" + err)
                    result.status = 409
                    result.message = "Mysql error occured!"
                } else {
                    logger.debug('rows found!')
                    logger.debug(rows)
                    result.status = 201
                    result.rows = rows
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