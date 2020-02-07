
const logger = require('link_logger')
const mysqlDbUOW = require('../models/MySqlUnitOfWork')
const { StatusError_400 } = require('link_http_code')
/**
 * Main function
 * Check if body is well formed and delegate to models the request
 */
module.exports.exec = (req, res) => {
    logger.info(req.body)
    if (checkBodyMysql(req.body)) {
        // Body is well formed!
        mysqlDbUOW.exec(req.body.configName, req.body.sql, req.body.args, result => {
            res.status(result.status || 500).send(result)
        })
    } else {
        // Body is not well formed!
        logger.error(`Bad request! Could not get all informations required or expected a mysql configuration! : 
                        'configName'= ${req.body.configName}, 
                        'sql'= ${req.body.sql}`)
        // Send bad request error
        res.status(400).send(new StatusError_400())
    }
}
/**
 * Check if body is well formed
 */
checkBodyMysql = body => {
    return (body.configName !== undefined
        && body.sql !== undefined
    )
}
