
const mongoDbUOW = require("../models/MongoDbUnitOfWork")
const logger = require("link_logger")


exports.get = (req, res) => {
    if(checkinput(req.query)) {
        mongoDbUOW.exec(req.query.configNum, req.query.queryType, req.query.collection, req.query.queryContent, result => {
            res.send(result)
        })
    } else {
        logger.error(`Bad request! Could not get all informations required to execute request! : 
                        'configNum'= ${req.param.configNum}, 
                        'queryType'= ${req.param.queryType}, 
                        'collection'= ${req.param.collection}, 
                        'queryContent'= ${req.param.queryContent}`)
        res.send({
            "status" : 400,
            "message" : "Bad request!"
        })
    }
}


checkinput = input => {
    return (input.configNum !== undefined &&
            input.queryType !== undefined && 
            input.collection !== undefined &&
            input.queryContent !== undefined)
}
