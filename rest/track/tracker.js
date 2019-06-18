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
 * It defines 2 mains functions : 
 *          Request  :: which track the request and insert a track on request collection
 *          Response :: which track the response and insert a track on response collection
 */
class Tracker {
    /**
     * Constructor
     */
    constructor() {
        this.lifeTime = moment().valueOf()
        if (g_db) {
            console.log("Connected to database !".underline.green)
            this.db = g_db
        } else {
            console.log("g_db is undefined".underline.red)
            throw new TypeError("Could not set db attribute as g_db is undefined")
        }
    }
    track(req, res, next) {
        if ((moment().valueOf() - this.lifeTime) > 1200000) { // 20 minutes
            // this.saveJourney(req)
        }
        this.saveJourney(req)
        // console.log(req.cookies)
        // if(req.cookies.user_id === undefined){
        //     this.userIdentifier = uuidv1()
        //     res.cookie('user_id',this.userIdentifier)
        // } else {
        //     this.userIdentifier = req.cookies.user_id
        // }
        // this.request(req)
        // res.on('finish', () => {
        //     this.response(res)
        // })
        next()
    }
    /**
     * 
     * @param {*} req Request
     */
    async saveJourney(req) {
        let track = await RequestSchema.findOne({ journey: false }, (err, track) => {
            console.log("test")
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
        let previousTrack = ""
        let previousTimestamp = ""
        journeyJson.journey = []
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
            let findResCond =  { link_id : { $in: link_id_tab } }
            let responses = await ResponseSchema.find(findResCond, async (err, responses) => {
                if(err) {
                    console.log(err)
                } else {
                    return responses
                }
            })
            if (user_id === '') {
                summary.user_id = "unknown"
            } else {
                summary.user_id = user_id
            }
            summary.from = requests[0].timestamp
            summary.to = requests[0].timestamp
            await requests.forEach(async request => {
                let response = await this.getLinkedResponse(responses, request.link_id)
                let currentTrack = {}
                // console.log(track)
                if (summary.from > request.timestamp) {
                    summary.from = request.timestamp
                }
                if (summary.to < request.timestamp) {
                    summary.to = request.timestamp
                }
                currentTrack.isDangerous = request.isDangerous
                currentTrack.body = request.req.body
                if (previousTrack === "") {
                    previousTrack = request.req.action
                    summary.action = request.req.action
                    previousTimestamp = request.timestamp
                } else {
                    currentTrack.timestamp = previousTimestamp
                    currentTrack.accesslength = request.timestamp - previousTimestamp
                    currentTrack.currentPath = previousTrack
                    currentTrack.requestedPath = request.req.action
                    previousTrack = request.req.action
                    summary.action += " > " + request.req.action
                    summary.totaltime += (request.timestamp - previousTimestamp)
                    previousTimestamp = request.timestamp
                    journeyJson.journey.push(currentTrack)
                }
                currentTrack.reqbody = request.body
                currentTrack.res.cookies = response.cookies
                currentTrack.res.error = response.error
                currentTrack.res.locals = response.locals
                currentTrack.res.restime = response.timestamp - response.timestamp
                request.journey = true
                request.save(err => {
                    if (err) console.log(err)
                })
            })
            summary.totaltime = summary.totaltime
            journeyJson.summary = summary
            console.log(journeyJson)
            return journeyJson
        } catch (e) {
            console.log(e)
        }
    }
    async getLinkedResponse(responses, link_id){
        await responses.forEach(response => {
            if(response["link_id"]){
                return response
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