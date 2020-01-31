
const mongoDbUOW = require('../models/MongoDbUnitOfWork')
const logger = require('link_logger')
const { StatusError_400 } = require('link_http_code')
const uuidv4 = require('uuid/v4')
/**
 * Main function
 * Check if body is well formed and delegate to models the request
 */
module.exports.exec = (req, res) => {
    if(checkBodyMongo(req.body)) {
        // Body is well formed!
        // let userHashKey
        // if (req.cookies === undefined || req.cookies.cache_uuid === undefined) {
        //     userHashKey = uuidv4()
        //     res.cookie('cache_uuid', userHashKey)
        // } else {
        //     userHashKey = req.cookies.cache_uuid
        // }
        // mongoDbUOW.exec(req.body, userHashKey, result => {
        mongoDbUOW.exec(req.body, result => {
            res.status(result.status).send(result)
        })
    } else {
        // Body is not well formed!
        logger.error(`Bad request! Could not get all informations required to execute request! : 
                        'configName'= ${req.body.configName}, 
                        'queryType'= ${req.body.queryType}, 
                        'collection'= ${req.body.collection}`)
        // Send bad request error
        res.status(400).send(new StatusError_400())
    }
}

/**
 * Check if body is well formed
 */
checkBodyMongo = body => {
    return (body.configName !== undefined 
            && body.queryType !== undefined
            && body.collection !== undefined)
}


