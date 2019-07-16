// Use moment to get current timestamp
const moment = require("moment")
const colors = require("colors")
const uuidv1 = require('uuid/v1')
// Getting Request and Response Schema
const RequestSchema = require("./Schema/requestSchema")
const ResponseSchema = require("./Schema/responseSchema")
const JourneySchema = require("./Schema/journeySchema")
const sanitizeHtml = require('sanitize-html')
const async = require("async")

// Creating Mongoose connection
const mongoose = require('mongoose')
const mongoConnectionStr = 'mongodb://127.0.0.1/tracking'
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
const g_db = mongoose.connection

/**
 * Tracker Class
 * It creates request tracking objects, response tracking objects and user journey after disconnection : 
 * Here are the main methods
 *          constructor : Establish connection to mongodb database
 *          track : This is the "main" function to call when tracking a site
 *          
 *          Request  :: which track the request and insert a track on request collection
 *          Response :: which track the response and insert a track on response collection
 *          Response :: which track the response and insert a track on response collection
 */
class Tracker {
    /**
     * Constructor
     * Establish connection to mongodb database
     */
    constructor() {
        /**
         * Lifetime define the time when a user connects to a site
         * It's used to know when a user connects and when a user disconnects to a site
         */
        this.lifeTime = moment().valueOf()
        this.requestedTimestamp = {}
        this.reqPath = ""
        this.responseTimestamp = {}        // Check if connection was correctly instanciated
        if (g_db) {
            console.log("Connected to database !".underline.green)
            // Create tracker object by giving it an instance of mongoose
            this.db = g_db
        } else {
            console.log("g_db is undefined".underline.red)
            // throw error if instance wasn't correctly instanciated
            throw new TypeError("Could not set db attribute as g_db is undefined")
        }
    }
    /**
     * This is the "main" function to call when tracking a site
     * 
     * @param {*} req   Request object picked up from server 
     * @param {*} res   Request object picked up from server
     * @param {*} next  ensure that after tracking request/response, it goes next
     */
    track(req, res, next) {
        // We consider that user is disconected after 20 min of inactivity
        
        if (moment.duration(moment().diff(moment(this.lifeTime))).asMilliseconds() > 1200000) { // 20 minutes
            // Create a journey of disconnected user
            this.saveUserJourney(req)
        }
        // Add to user an id to identify it and distinguish it from others
        if(req.cookies.user_id === undefined){
            // create unique uuid base on time
            let u_id = uuidv1()
            // add it to res/req cookie
            res.cookie('user_id',u_id)
            req.cookies.user_id = u_id
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
    async saveAllJourney(){
        let track = await RequestSchema.findOne({ journey: false }, (err, track) => {
            console.log("test")
            if (err) {
                console.log(err)
            }
            if (track) {
                if(track.cookies.user_id !== undefined){
                    this.saveUserJourney(track.cookies.user_id)
                } else {
                    this.saveUserJourney("")
                }
            }
        })
    }
    /**
     * This method creates a journey from tracked user informations
     * 
     * @param {*} req Request object picked up from server 
     */
    async saveUserJourney(user_id) {
        try {
            let journeyJson = await this.createJourneyForUserId(user_id)
            await this.insertJourney(journeyJson)
        } catch (e) {
            console.log(e)
        }
    }
    /** 
     * Create a journey for a defined user_id
     * 
     * @param {*} user_id user_id
     */
    async createJourneyForUserId(user_id) {
        // returned journey Json object (journey + summary)
        let journeyJson = {}
        // summarized all founded req/res
        let summary = {}
        summary.totaltime = 0
        summary.total_req = 0
        summary.isDanger_req = 0
        summary.isError_req = 0

        // condition used in request query
        let findReqCond = {}
        // condition used in response query
        let findResCond = {}

        // keep in memory last track informations : Used while creating journey objects
        let previousAction = ""
        // keep in memory last timestamp : Used while creating journey objects
        let previousTimestamp = ""

        // list of unregistered requests found for user_id 
        let requests = {}
        // list of request-link-id
        let link_id_tab = []
        // list of request-linked responses 
        let responses = {}
        // sum up req/res object
        let tracks = []

        console.log(user_id)
        // Check if user_id is well defined
        if (user_id === "") {
            findReqCond = { 'cookies.user_id' : { $exists: false }, journey: false }
        } else {
            findReqCond = { 'cookies.user_id': user_id, journey: false }
        }
        try {
            // get all request for user_id
            requests = await RequestSchema.find(findReqCond,[],{ sort: { timestamp: 1 } }, (err, result) => {
                if (err) console.log(err)
                if (!result) {
                } else {
                    return result
                }
            })
            // get link_id attribute for each request and add it to link_id_tab array
            await requests.forEach(request => {
                link_id_tab.push(request.link_id)
            })
            // create response query condition based on link_id_tab
            findResCond =  { link_id : { $in: link_id_tab } }

            // Get all requests-linked responses
            responses = await ResponseSchema.find(findResCond, async (err, responses) => {
                if(err) {
                    console.log(err)
                } else {
                    return responses
                }
            })
            // associate all requests/response to a track object
            await requests.forEach(async request => {
                let track =  {}
                await this.getLinkedResponse(responses, request.link_id, result => {
                    track.reqTrack = request
                    track.resTrack = result
                    // then add it to track array
                    tracks.push(track)
                })
            })
            // Add user_id to summary (journey's attribute)
            if (user_id === '') {
                // If empty string, set it to unknown
                summary.user_id = "unknown"
            } else {
                summary.user_id = user_id
            }
            // update from/to summary attributes
            summary.from = tracks[0].reqTrack.timestamp
            summary.to = tracks[0].reqTrack.timestamp

            // loop all tracks and create journeys
            await tracks.forEach(async track => {
                if(track.reqTrack.req.action !== "/favicon.ico"){
                    // update summary.from/to
                    if (summary.from > track.reqTrack.timestamp) {
                        summary.from = track.reqTrack.timestamp
                    }
                    if (summary.to < track.reqTrack.timestamp) {
                        summary.to = track.reqTrack.timestamp
                    }   
                    // count dangerous requests
                    if(track.reqTrack.isDangerous){
                        summary.isDanger_req ++
                    }
                    // count error responses
                    if(track.resTrack.error){
                        summary.isError_req ++
                    }
                    if (previousAction === "") {
                        previousAction = track.reqTrack.req.action
                        summary.action = track.reqTrack.req.action
                        previousTimestamp = track.reqTrack.timestamp
                    } else {
                        // update previous action
                        previousAction = track.reqTrack.req.action
                        // add action summary
                        summary.action += " > " + track.reqTrack.req.action
                        // add time to get total time
                        console.log(moment.duration(moment(track.reqTrack.timestamp).diff(moment(previousTimestamp))).asMilliseconds())
                        summary.totaltime += moment.duration(moment(track.reqTrack.timestamp).diff(moment(previousTimestamp))).asMilliseconds()
                        // update previous timeStamp
                        previousTimestamp = track.reqTrack.timestamp
                    }
                }
                // update reqTrack to inform that he got registered
                track.reqTrack.journey = true
                track.reqTrack.save(err => {
                    if (err) console.log(err)
                })
            })
            summary.total_req = tracks.length
            journeyJson.summary = summary
            return journeyJson
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * get linked response
     * 
     * @param {*} responses array of all responses found in link_id_tab array : array of all requests link_id attribute
     * @param {*} link_id   request link_id used to find linked response
     * @param {*} callback  function to call after methods ended
     */
    async getLinkedResponse(responses, link_id, callback){
        await responses.forEach(response => {
            if(response.link_id.toString() === link_id.toString()) {
                callback(response)
            }
        })
    }
    /**
     * Insert created journey Json object to mongodb database
     * 
     * @param {*} journeyJson 
     */
    async insertJourney(journeyJson) {
        // insert journey to mongodb database
        JourneySchema.insertMany(journeyJson, (err, result) => {
            if (err) {
                console.log(err)
                return false
            } else {
                // console.log(result)
                console.log("Journey created")
                return true
            }
        })
    }
    /**
     * Create a Request Track from user request informations
     * 
     * @param {*} req 
     */
    request(req) {
        // create request json request object
        let jsonRequest = this.createRequestTrack(req)
        // insert json request object
        this.insertRequestTrack(jsonRequest)
    }
    createRequestTrack(req) {
        let jsonRequest = {}
        jsonRequest.timestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.requestedTimestamp = jsonRequest.timestamp
        this.lifeTime = moment().valueOf()
        if (req.cookies !== undefined) {
            this.cookies = req.cookies
            jsonRequest.cookies = req.cookies
        } else if (this.cookies !== undefined) {
            jsonRequest.cookies = this.cookies
        }
        jsonRequest.req = {}
        jsonRequest.req.body = req.body
        this.reqPath = req.path
        jsonRequest.req.action = this.reqPath
        jsonRequest.req.method = req.method
        jsonRequest.req.remoteAddress = req.connection.remoteAddress
        if (this.isDangerous(req.body)) {
            jsonRequest.isDangerous = true
        } else {
            jsonRequest.isDangerous = false
        }
        this.link_id = new mongoose.Types.ObjectId
        jsonRequest.link_id = this.link_id
        jsonRequest.journey = false
        return jsonRequest
    }
    insertRequestTrack(jsonTracking) {
        RequestSchema.insertMany(jsonTracking, (err, result) => {
            if (err) {
                console.log(err)
                return false
            } else {
                return true
            }
        })
    }
    isDangerous(object) {
        for (const prop in object) {
            if (typeof (object[prop]) === "object") {
                if (isDangerous(object[prop])) {
                    return true
                }
            } else {
                if (typeof (object[prop]) === "string") {
                    var clean = sanitizeHtml(object[prop])
                    // console.log("Clean : " + clean + "   -    origin : " + object[prop])
                    if (clean !== object[prop]) {
                        return true
                    }
                }
            }
        }
        return false
    }
    /**
     * Response
     */
    response(res) {
        let jsonResponse = this.createResponseTrack(res)
        this.insertResponseTrack(jsonResponse)
    }
    createResponseTrack(res) {
        let jsonResponse = {}
        jsonResponse.timestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.responseTimestamp = jsonResponse.timestamp
        jsonResponse.restime = moment.duration(moment(this.responseTimestamp).diff(moment(this.requestedTimestamp))).asMilliseconds()
        if (res.cookies !== undefined) {
            this.cookies = res.cookies
            jsonResponse.cookies = res.cookies
        } else if (this.cookies !== undefined) {
            jsonResponse.cookies = this.cookies
        }
        jsonResponse.link_id = this.link_id
        if (res.statusCode !== 200) {
            jsonResponse.error = {}
            if (res.error !== undefined) {
                jsonResponse.error.message = res.error.message
                jsonResponse.error.status = res.error.status
                jsonResponse.error.level = res.error.level
                jsonResponse.error.detail = res.error.detail
            }
        }
        jsonResponse.action = this.reqPath
        jsonResponse.locals = res.locals
        return jsonResponse
    }
    insertResponseTrack(jsonTracking, callback) {
        ResponseSchema.insertMany(jsonTracking, (err, result) => {
            if (err) {
                console.log(err)
                return false
            } else {
                return true
            }
        })
    }
}
module.exports = new Tracker()