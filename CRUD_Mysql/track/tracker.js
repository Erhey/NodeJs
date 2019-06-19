// Use moment to get current timestamp
const moment = require("moment")
const colors = require("colors")
const uuidv1 = require('uuid/v1');
// Getting Request and Response Schema
const RequestSchema = require("./Schema/requestSchema")
const ResponseSchema = require("./Schema/responseSchema")
const JourneySchema = require("./Schema/journeySchema")
const sanitizeHtml = require('sanitize-html');
const async = require("async");

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
        // Get current time when user is connected to server
        this.lifeTime = moment().valueOf()

        // Check if connection was correctly instanciated
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
        if ((moment().valueOf() - this.lifeTime) > 1200000) { // 20 minutes
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
    /**
     * This method creates a journey from tracked user informations
     * 
     * @param {*} req Request object picked up from server 
     */
    async saveUserJourney(req) {
        // find if there are any unrecorded requests/responses
        console.log(req.cookies)
        let track = await RequestSchema.findOne({ journey: false, user_id : req.cookies.user_id }, (err, track) => {
            // console.log("test")
            if (err) {
                console.log(err)
            }
            if (track) {
                console.log(track)
                return track
            }
        })
        if (track) {
            if (track.req !== undefined && track.cookies !== undefined) {
                try {
                    let journeyJson = await this.createJourneyForUserReq(req, track.cookies['user_id'])
                    await this.insertJourney(journeyJson)
                } catch (e) {
                    console.log(e)
                }
            } else {
                try {
                    let journeyJson = await this.createJourneyForUserReq(req, "")
                    await this.insertJourney(journeyJson)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
    /** 
     * Create a journey for a defined user using request collection
     * 
     * @param {*} req Request informations
     * @param {*} user_id user_id
     */
    async createJourneyForUserReq(req, user_id) {

        let journeyJson = {}
        let findCond = {}
        let summary = {}
        summary.totaltime = 0
        summary.total_req = 0
        summary.isDanger_req = 0
        summary.isError_req = 0
        let previousTrack = ""
        let previousTimestamp = ""
        journeyJson.journey = []
        let link_id_tab = []
        console.log(user_id)
        if (user_id === "") {
            findCond = { 'cookies.user_id' : {$exists: false}, journey: false }
        } else {
            findCond = { 'cookies.user_id': user_id,  journey: false }
        }
        try {
            let requests = await RequestSchema.find(findCond,[],{ sort: { timestamp: 1 } }, (err, requests) => {
                if (err) console.log(err)
                if (!requests) {
                } else {
                    return requests
                }
            })
            await requests.forEach(request => {
                link_id_tab.push(request.link_id)
            })
            let findResCond =  { link_id : { $in: link_id_tab } }
            let responses = await ResponseSchema.find(findResCond, async (err, responses) => {
                if(err) {
                    console.log(err)
                } else {
                    return responses
                }
            })
            let tracks = []
            
            await requests.forEach(async request => {
                let track =  {}
                await this.getLinkedResponse(responses, request.link_id, result => {
                    track.reqTrack = request
                    track.resTrack = result
                    tracks.push(track)
                })
            })
            if (user_id === '') {
                summary.user_id = "unknown"
            } else {
                summary.user_id = user_id
            }
            
            // console.log(responses)
            summary.from = tracks[0].reqTrack.timestamp
            summary.to = tracks[0].reqTrack.timestamp
            await tracks.forEach(async track => {
                let currentTrack = {}
                currentTrack.res = {}
                currentTrack.req = {}
                // console.log(track)
                if (summary.from > track.reqTrack.timestamp) {
                    summary.from = track.reqTrack.timestamp
                }
                if (summary.to < track.reqTrack.timestamp) {
                    summary.to = track.reqTrack.timestamp
                }
                if(track.reqTrack.isDangerous){
                    summary.isDanger_req ++
                }
                if(track.resTrack.error){
                    summary.isError_req ++
                }
                currentTrack.isDangerous = track.reqTrack.isDangerous
                currentTrack.reqbody = track.reqTrack.req.body
                if (previousTrack === "") {
                    previousTrack = track.reqTrack.req.action
                    summary.action = track.reqTrack.req.action
                    previousTimestamp = track.reqTrack.timestamp
                } else {
                    currentTrack.timestamp = previousTimestamp
                    currentTrack.accesslength = track.reqTrack.timestamp - previousTimestamp
                    currentTrack.currentPath = previousTrack
                    currentTrack.requestedPath = track.reqTrack.req.action
                    previousTrack = track.reqTrack.req.action
                    summary.action += " > " + track.reqTrack.req.action
                    summary.totaltime += (track.reqTrack.timestamp - previousTimestamp)
                    
                    previousTimestamp = track.reqTrack.timestamp
                    currentTrack.reqbody = track.reqTrack.req.body
                    currentTrack.res.cookies = track.resTrack.cookies
                    currentTrack.res.error = track.resTrack.error
                    currentTrack.res.locals = track.resTrack.locals
                    currentTrack.res.restime = track.resTrack.timestamp - track.reqTrack.timestamp
                    journeyJson.journey.push(currentTrack)
                }
                track.reqTrack.journey = true
                track.reqTrack.save(err => {
                    if (err) console.log(err)
                })
            })
            summary.total_req = tracks.length
            journeyJson.summary = summary
            // console.log(journeyJson)
            return journeyJson
        } catch (e) {
            console.log(e)
        }
    }
    async getLinkedResponse(responses, link_id, callback){
        console.log("test")
        await responses.forEach(response => {
            if(response.link_id.toString() === link_id.toString()) {
                console.log("test3")
                callback(response)
            }
        })
    }

    async insertJourney(journeyJson) {
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
     * Request
     */
    request(req) {
        let jsonRequest = this.createRequestTrack(req)
        this.insertRequestTrack(jsonRequest)
    }
    createRequestTrack(req) {
        let jsonRequest = {}
        jsonRequest.timestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.lifeTime = moment().valueOf()
        if (req.cookies !== undefined) {
            this.cookies = req.cookies
            jsonRequest.cookies = req.cookies
        } else if (this.cookies !== undefined) {
            jsonRequest.cookies = this.cookies
        }
        jsonRequest.req = {}
        jsonRequest.req.body = req.body
        jsonRequest.req.action = req.path
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
    insertRequestTrack(jsonTracking, callback) {
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
                    var clean = sanitizeHtml(object[prop]);
                    console.log("Clean : " + clean + "   -    origin : " + object[prop])
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