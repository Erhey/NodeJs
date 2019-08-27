
const logger = require("link_logger")
const { exec } = require("../models/MySqlUnitOfWork")
const { isMysql } = require("link_connection")

exports.exec = (req, res) => {
    if(checkQuery(req.query)) {
        exec(req.query.configName, req.query.sql, req.query.args, result => {
            res.send(result)
        })
    } else {
        logger.error(`Bad request! Could not get all informations required or expected a mysql configuration! : 
                        'configName'= ${req.param.configName}, 
                        'sql'= ${req.param.sql}, 
                        'args'= ${req.param.args}`)
        res.send({
            "status" : 400,
            "message" : "Bad request!"
        })
    }
}

checkQuery = query => {
    return (query.configName !== undefined
        && isMysql(query.configName)
        && query.sql !== undefined
    )
}
