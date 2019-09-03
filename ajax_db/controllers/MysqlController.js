
const logger = require('link_logger')
const mysqlDbUOW = require('../models/MySqlUnitOfWork')

module.exports.exec = (req, res) => {
    if (checkBodyMysql(req.body)) {
        mysqlDbUOW.exec(req.body.configName, req.body.sql, req.body.args, result => {
            res.status(result.status || 500).send(result)
        })
    } else {
        logger.error(`Bad request! Could not get all informations required or expected a mysql configuration! : 
                        'configName'= ${req.body.configName}, 
                        'sql'= ${req.body.sql}`)
        res.status(400).send({
            status: 400,
            message: 'Bad request!'
        })
    }
}

checkBodyMysql = body => {
    return (body.configName !== undefined
        && body.sql !== undefined
    )
}
