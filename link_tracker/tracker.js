// Get utilities module
const moment = require('moment')
const sanitizeHtml = require('sanitize-html')
const mongoose = require('mongoose')
const logger = require('link_logger')
const link_models = require('link_models')
const { requestSchema, responseSchema } = link_models.getMongoConnection('tracking')
/** 
 * Tracker Class
 * It creates request tracking objects, response tracking objects on each connections and save them on mongodb database : 
 * Here are the main methods
 *      Global
 *  
 *          constructor : Establish connection to mongodb database
 *          track : This is the main function to call when tracking a site
 *  
 *      Request 
 *  
 *          request : Create and save to database user request and insert a track to database
 *          createRequest : Internal function use in Request process to create request json to save to database 
 *          insertRequest : Save to database user Request 
 *  
 *      Response 
 *  
 *          response : Create and save to database user response and insert a track to database
 *          createResponse : Internal function use in Response process to create request json to save to database 
 *          insertResponse : Save to database user Response 
 *  
 */
class Tracker {
    /**
     * Constructor
     * Establish connection to mongodb database
     * 
     * @param {String} configuration name MongoDB connection string.
     */
    constructor(configName, user_token_name) {
        this.user_token_name = user_token_name
        this.configName = configName
        /**
         * Lifetime define the time when a user connects to a site
         * It's used to know when a user connects and when a user disconnects to a site
         */
        this.lifeTime = moment().valueOf()
        /**
         * Save temporary requestedTimeStamp
         */
        this.requestedTimestamp = {}
        /**
         * Save temporary responseTimestamp
         */
        this.responseTimestamp = {}
        this.reqPath = ''
    }
    /**
     * This is the main function to call when tracking a site
     * 
     * @param {Mixed} req   Request object picked up from server 
     * @param {Mixed} res   Request object picked up from server
     * @param {Callback} next  ensure that after tracking request/response, it goes next
     */
    track(req, res, next) {
        if (!req.path.includes("favicon.ico")) {
            logger.debug('track(req, res, next)')
            // Create request track document
            this.request(req)
            // Wait that response was sended
            res.on('finish', () => {
                // Then create response track document
                this.response(res)
            })
        }
        next()
    }
    /**
     * Create and save to database user track the request and insert a track on request collection
     * 
     * @param {Mixed} req 
     */
    request(req) {
        try {
            logger.debug('request(req)')
            logger.info('Request from user received!')
            // create request json request object
            let requestJson = this.createRequest(req)
            // insert json request object
            this.insertRequest(requestJson)
        } catch (e) {
            logger.error('Error on request function : ' + e.toString())
        }
    }
    /**
     * Internal function use in Request process to create request json to save to database 
     * 
     * @param {Mixed} req 
     */
    createRequest(req) {
        logger.debug('createRequest(req)')
        logger.info('Creating request start')
        let requestJson = {}
        // Get response timestamp
        requestJson.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        this.requestedTimestamp = requestJson.timestamp
        // The user is still here so we haveto reset lifeTime
        this.lifeTime = moment().valueOf()
        // Get cookies 
        try {
            requestJson.req = {}
            if (this.user_token_name !== undefined) {
                // If exist get User token
                logger.info(req.cookies)
                requestJson.user_uuid = req.cookies[this.user_token_name]
            }
            // Get path saved to class object
            this.reqPath = req.path
            // Get path 
            requestJson.req.action = this.reqPath
            // Get method (GET/POST/PUT/DELETE) 
            requestJson.req.method = req.method
            // Check if request is dangerous
            if (this.isDangerous(req.body)) {
                requestJson.isDangerous = true
                requestJson.req.body = req.body
            } else {
                requestJson.isDangerous = false
            }
            // Create a link_id used further when response is called
            this.link_id = new mongoose.Types.ObjectId
            requestJson.link_id = this.link_id
            logger.info('Creating request end')
            return requestJson
        } catch (e) {
            throw e
        }
    }
    /**
     * Save to database user Request 
     * 
     * @param {JSON} requestJson 
     */
    insertRequest(requestJson) {
        try {
            logger.debug('insertRequest(requestJson)')
            logger.info('Insert request to database start')
            // Insert to database a request
                requestSchema.insertMany(requestJson, (err, result) => {
                    if (err) {
                        throw err
                    } else {
                        logger.info('Request created')
                        return true
                    }
            })
        } catch (e) {
            throw e
        }
    }
    /**
     * Internal function used in request to check if the request contains javascript injections 
     * 
     * @param {Mixed} object Object to be checked
     */
    isDangerous(object) {
        for (const prop in object) {
            if (typeof (object[prop]) === 'object') {
                if (isDangerous(object[prop])) {
                    return true
                }
            } else {
                if (typeof (object[prop]) === 'string') {
                    let clean = sanitizeHtml(object[prop])
                    if (clean !== object[prop]) {
                        return true
                    }
                }
            }
        }
        return false
    }
    /**
     * Create and save to database user response and insert a track to database
     * 
     * @param {Mixed} res 
     */
    response(res) {
        logger.info('Response from server!')
        try {
            // create response json response object
            let responseJson = this.createResponse(res)
            // insert json response object
            this.insertResponse(responseJson)
        } catch (e) {
            logger.error('Error on response function : ' + e.toString())
        }
    }
    /**
     * Internal function use in Response process to create request json to save to database 
     * 
     * @param {Mixed} res 
     */
    createResponse(res) {
        logger.info('Creating response Json start')
        let responseJson = {}
        // Get response timestamp
        responseJson.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        this.responseTimestamp = responseJson.timestamp
        // Get response time
        responseJson.restime = moment.duration(moment(this.responseTimestamp).diff(moment(this.requestedTimestamp))).asMilliseconds()
        // set link_id
        responseJson.link_id = this.link_id
        try {
            // Get cookies 
            if (res.cookies !== undefined) {
                responseJson.user_uuid = req.cookies[this.user_token_name]
            }
            // Get error if exist
            if (res.statusCode !== 200) {
                responseJson.error = {}
                if (res.error !== undefined) {
                    responseJson.error.message = res.error.message
                    responseJson.error.status = res.error.status
                    responseJson.error.level = res.error.level
                    responseJson.error.detail = res.error.detail
                }
            }
            // Get response path
            responseJson.action = this.reqPath
            // Get locals
            responseJson.locals = res.locals
            logger.info('Creating response Json end')
            return responseJson
        } catch (e) {
            throw e
        }
    }
    /**
     * Save to database user Response 
     * 
     * @param {JSON} responseJson 
     */
    insertResponse(responseJson) {
        try {
            logger.info('Insert response to database start')
            // Insert to database a response
                responseSchema.updateMany(responseJson, (err, result) => {
                    if (err) {
                        throw err
                    } else {
                        logger.info('Request created')
                        return true
                    }
            })
        } catch (e) {
            throw e
        }
    }
}
/**
 * Function to be exported. Create a Tracker with parameters.
 * 
 * @param {String} configName 
 * @param {uuid} user_token_name 
 */
trackerBuilder = (configName, user_token_name) => {
    return new Tracker(configName, user_token_name)
}

module.exports = trackerBuilder