// Get utilities module
const moment = require('moment')
const sanitizeHtml = require('sanitize-html')
const mongoose = require('mongoose')
const logger = require('link_logger')(__filename)
const link_schema = require('link_schema')

/** 
 * Tracker Class
 * It creates request tracking objects, response tracking objects and user journey after disconnection : 
 * Here are the main methods
 *      Global
 *  
 *          constructor : Establish connection to mongodb database
 *          track : This is the main function to call when tracking a site
 *  
 *      Journey
 *  
 *          journey : Create and save to database user journey which sum up what user did during its visit 
 *          createJourney : Internal function use in journey process to create journey json to save to database 
 *          insertJourney : Save to database user journey 
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
     * @param {String} db MongoDB connection string.
     */
    constructor(db, user_token_name) {
        this.user_token_name = user_token_name
        this.mongoConnection = link_schema.tracking[db].getMongoConnection
        this.responseSchema = link_schema.tracking[db].responseSchema
        this.requestSchema = link_schema.tracking[db].requestSchema
        this.journeySchema = link_schema.tracking[db].journeySchema
        // Check if connection was correctly instanciated
        if (this.mongoConnection) {
            logger.info('Connected to database !')
        } else {
            logger.error('mongoConnection is undefined')
            // throw error if instance wasn't correctly instanciated
            throw new TypeError('Could not mongo connection! Please check the mongodb connection on your entry point : (example : app.js)')
        }
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
        logger.debug('track(req, res, next)')
        // We consider that user is disconected after 20 min of inactivity
        if (moment.duration(moment().diff(moment(this.lifeTime))).asMilliseconds() > 1200000) { // 20 minutes
            // Create a journey of disconnected user
            this.journey(req)
        }
        // Create request track document
        this.request(req)
        // Wait that response was sended
        res.on('finish', () => {
            // Then create response track document
            this.response(res)
        })
        next()
    }
    /**
     * Create and save to database user journey which sum up what user did during its visit 
     * 
     * @param {Mixed} req Request object picked up from server 
     */
    async journey(user_id) {
        logger.debug('journey('  + user_id + ')')
        try {
            // create journey json journey object
            let journeyJson = await this.createJourney(user_id)
            // insert json journey object
            await this.insertJourney(journeyJson)
        } catch (e) {
            logger.error('Error on journey function : ' + e.toString())
        }
    }
    /**
     * Save all Journey to database
     * 
     */
    async saveAllJourney() {
        logger.debug('saveAllJourney()')
        try {
            await this.requestSchema.findOne({ journey: false }, (err, track) => {
                if (err) {
                    throw err
                }
                if (track) {
                    if (track.cookies.user_id !== undefined) {
                        this.journey(track.cookies.user_id)
                    } else {
                        this.journey('')
                    }
                }
            })
        } catch (e) {
            logger.error('Error on saveAllJourney : ' + e.toString())
        }
    }
    /** 
     * Internal function use in journey process to create journey json to save to database 
     * 
     * @param {uuid} user_id user_id
     */
    async createJourney(user_id) {
        logger.debug('createJourney('  + user_id + ')')
        logger.info('Creating a journey for user : ' + user_id + ' start')
        // Initialization of returned Json journey object
        let journeyJson = {}
        journeyJson.totaltime = 0
        journeyJson.total_req = 0
        journeyJson.isDanger_req = 0
        journeyJson.isError_req = 0

        // condition used in request query
        let findReqCond = {}
        // condition used in response query
        let findResCond = {}

        // keep in memory last track informations : Used while creating journey objects
        let previousAction = ''
        // keep in memory last timestamp : Used while creating journey objects
        let previousTimestamp = ''

        // list of unregistered requests found for user_id 
        let requests = {}
        // list of request-link-id
        let link_idList = []
        // list of request-linked responses 
        let responses = {}
        // sum up req/res object
        let tracks = []

        // Check if user_id is well defined
        if (user_id === '') {
            findReqCond = { 'cookies.user_id': { $exists: false }, journey: false }
        } else {
            findReqCond = { 'cookies.user_id': user_id, journey: false }
        }
        try {
            // get all request for user_id
            requests = await this.requestSchema.find(findReqCond, [], { sort: { timestamp: 1 } }, (err, result) => {
                if (err) {
                    throw err
                }
                if (result) {
                    return result
                }
            })
            // get link_id attribute for each request and add it to link_idList array
            await requests.forEach(request => {
                link_idList.push(request.link_id)
            })
            // create response query condition based on link_idList
            findResCond = { link_id: { $in: link_idList } }

            // Get all requests-linked responses
            responses = await this.responseSchema.find(findResCond, async (err, responses) => {
                if (err) {
                    throw err
                } else {
                    return responses
                }
            })
            // associate all requests/response to a track object
            await requests.forEach(async request => {
                let track = {}
                await responses.forEach(response => {
                    if (response.link_id.toString() === request.link_id.toString()) {
                        track.reqTrack = request
                        track.resTrack = response
                        // then add it to track array
                        tracks.push(track)
                    }
                })
            })
            // Add user_id to summary (journey's attribute)
            if (user_id === '') {
                // If empty string, set it to unknown
                journeyJson.user_id = 'unknown'
            } else {
                journeyJson.user_id = user_id
            }
            // update from/to summary attributes
            journeyJson.from = tracks[0].reqTrack.timestamp
            journeyJson.to = tracks[0].reqTrack.timestamp
            // loop all tracks and create journeys
            await tracks.forEach(async track => {
                if (track.reqTrack.req.action !== '/favicon.ico') {
                    // update journeyJson.from/to
                    if (journeyJson.from > track.reqTrack.timestamp) {
                        journeyJson.from = track.reqTrack.timestamp
                    }
                    if (journeyJson.to < track.reqTrack.timestamp) {
                        journeyJson.to = track.reqTrack.timestamp
                    }
                    // count dangerous requests
                    if (track.reqTrack.isDangerous) {
                        journeyJson.isDanger_req++
                    }
                    // count error responses
                    if (track.resTrack.error) {
                        journeyJson.isError_req++
                    }
                    if (previousAction === '') {
                        previousAction = track.reqTrack.req.action
                        journeyJson.action = track.reqTrack.req.action
                        previousTimestamp = track.reqTrack.timestamp
                    } else {
                        // update previous action
                        previousAction = track.reqTrack.req.action
                        // add action summary
                        journeyJson.action += ' > ' + track.reqTrack.req.action
                        // add time to get total time
                        journeyJson.totaltime += moment.duration(moment(track.reqTrack.timestamp).diff(moment(previousTimestamp))).asMilliseconds()
                        // update previous timeStamp
                        previousTimestamp = track.reqTrack.timestamp
                    }
                }
                // update reqTrack to inform that he got registered
                track.reqTrack.journey = true
                track.reqTrack.save(err => {
                    if (err) {
                        throw err
                    }
                })
            })
            journeyJson.total_req = tracks.length
            logger.info('Creating a journey for user : ' + user_id + ' end')
            return journeyJson
        } catch (e) {
            throw e
        }
    }
    /**
     * Save to database user journey 
     * 
     * @param {JSON} journeyJson 
     */
    async insertJourney(journeyJson) {
        logger.debug('insertJourney(journeyJson)')
        logger.info('Insert journey to database start')
        // insert journey to mongodb database
        try {
            this.journeySchema.insertMany(journeyJson, (err, result) => {
                if (err) {
                    throw err
                } else {
                    logger.info('Journey created')
                    return true
                }
            })
        } catch (e) {
            throw e
        }
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
            if(this.user_token_name !== undefined){
                // If exist get User token
                console.log(req.cookies)
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
            requestJson.journey = false
            logger.info('Creating request end')
            return requestJson
        } catch (e) {
            throw e
        }
    }
    /**
     * Save to database user Request 
     * 
     * @param {JSON} journeyJson 
     */
    insertRequest(journeyJson) {
        try {
            logger.debug('insertRequest(journeyJson)')
            logger.info('Insert request to database start')
            // Insert to database a request
            this.requestSchema.insertMany(journeyJson, (err, result) => {
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
        try {
            logger.info('Response from server!')
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
            this.responseSchema.insertMany(responseJson, (err, result) => {
                if (err) {
                    throw err
                } else {
                    logger.info('Response created')
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
 * @param {String} db 
 * @param {uuid} user_token_name 
 */
trackerBuilder = (db, user_token_name) => {
    return new Tracker(db, user_token_name) 
} 

module.exports = trackerBuilder