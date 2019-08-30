
const mongoDbUOW = require("../models/MongoDbUnitOfWork")
const logger = require("link_logger")


module.exports.exec = (req, res) => {
    if(checkBodyMongo(req.body)) {
        mongoDbUOW.exec(req.body.configName, req.body.queryType, req.body.collection, req.body.queryContent, result => {
            res.status(result.status || 500).send(result)
        })
    } else {
        logger.error(`Bad request! Could not get all informations required to execute request! : 
                        'configName'= ${req.body.configName}, 
                        'queryType'= ${req.body.queryType}, 
                        'collection'= ${req.body.collection}`)
        res.status(400).send({
            "status" : 400,
            "message" : "Bad request!"
        })
    }
}


checkBodyMongo = body => {
    return (body.configName !== undefined 
            && body.queryType !== undefined
            && body.collection !== undefined)
}
