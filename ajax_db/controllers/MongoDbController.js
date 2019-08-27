
const mongoDbUOW = require("../models/MongoDbUnitOfWork")
const logger = require("link_logger")


exports.exec = (req, res) => {
    if(checkQuery(req.body)) {
        mongoDbUOW.exec(req.body.configName, req.body.queryType, req.body.collection, req.body.queryContent, result => {
            res.send(result)
        })
    } else {
        logger.error(`Bad request! Could not get all informations required to execute request! : 
                        'configName'= ${req.body.configName}, 
                        'queryType'= ${req.body.queryType}, 
                        'collection'= ${req.body.collection}, 
                        'queryContent'= ${req.body.queryContent}`)
        res.send({
            "status" : 400,
            "message" : "Bad request!"
        })
    }
}


checkQuery = body => {
    console.log(body)
    return (body.configName !== undefined &&
            body.queryType !== undefined && 
            body.collection !== undefined)
}
