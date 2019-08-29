
const logger = require("link_logger")
const { exec } = require("../models/MySqlUnitOfWork")

exports.exec = (req, res) => {
    if(checkBody(req.body)) {
        exec(req.body.configName, req.body.sql, req.body.args, result => {
            res.status(result.status || 500).send(result)
        })
    } else {
        logger.error(`Bad request! Could not get all informations required or expected a mysql configuration! : 
                        'configName'= ${req.body.configName}, 
                        'sql'= ${req.body.sql}`)
        res.status(400).send({
            "status" : 400,
            "message" : "Bad request!"
        })
    }
}

checkBodyMysql = body => {
    return (body.configName !== undefined
        && body.sql !== undefined
    )
}
