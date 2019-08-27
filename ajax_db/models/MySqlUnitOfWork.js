const logger = require('link_logger')
const connector = require('../models/UnitOfWorkFactory')

module.exports = exec = async (configName, sql, args, callback) => {
    let connection = {}
    let result = {}
    try {
        connection = await getConnection(configName)
        connector(configName, async ({ connection }) => {
            await connection.query(sql, args, (err, result) => {
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
                connection.end()
            })
        })
    } catch (e) {
        logger.error("Unexpected Mysql error occured! Error : " + e)
        result.status = 410
        result.message = "Unexpected Mysql error occured!"
        callback(result)
        connection.end()
    }
}