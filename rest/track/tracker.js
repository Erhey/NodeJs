// Use moment to get current timestamp
const moment = require("moment")
const colors = require("colors")

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
        console.log(1)
        let cpt = 0
        let noMoreTracks = false
        let timestamp = moment().valueOf()
        console.log(moment().valueOf() - timestamp)
        // while (!noMoreTracks && (moment().valueOf() - timestamp < 2000)) { // 30s timeout
        // cpt++
        // console.log( moment().valueOf() - timestamp)
        let track = await RequestSchema.findOne({ 'req.remoteAddress': req.connection.remoteAddress, journey: false }, (err, track) => {
            console.log("test")
            if (err) {
                console.log(err)
            }
            if (track) {
                return track
            }
        })
        // }
        if (track) {
            console.log("je passe2")
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
            findCond = { 'req.remoteAddress': req.connection.remoteAddress, journey: false }
        } else {
            findCond = { 'req.remoteAddress': req.connection.remoteAddress, journey: false, 'cookies.user_id': user_id }
        }
        try {
            let tracks = await RequestSchema.find(findCond,
                [],
                {
                    sort: {
                        timestamp: 1 //Sort by Date Added DESC
                    }
                }, (err, tracks) => {
                    if (err) console.log(err)
                    if (!tracks) {
                    } else {
                        return tracks
                    }
                })
            if (user_id === '') {
                journeyJson.user_id = "unknown"
            } else {
                journeyJson.user_id = user_id
            }
            summary.from = tracks[0].timestamp
            summary.to = tracks[0].timestamp
            await tracks.forEach(track => {
                // console.log(track)
                let currentTrack = {}
                if (summary.from > track.timestamp) {
                    summary.from = track.timestamp
                }
                if (summary.to < track.timestamp) {
                    summary.to = track.timestamp
                }
                currentTrack.timestamp = track.timestamp
                currentTrack.isDangerous = track.isDangerous
                console.log(currentTrack.timestamp)
                currentTrack.body = track.req.body
                if (previousTrack === "") {
                    currentTrack.currentPath = track.req.action
                    currentTrack.requestedPath = track.req.action
                    previousTrack = track.req.action
                    summary.action = track.req.action
                    previousTimestamp = currentTrack.timestamp
                } else {
                    currentTrack.accesslength = ((track.timestamp - previousTimestamp) / 1000.0) + "s"
                    currentTrack.currentPath = previousTrack
                    currentTrack.requestedPath = track.req.action
                    previousTrack = track.req.action
                    summary.action += " > " + track.req.action
                    summary.totaltime += (track.timestamp - previousTimestamp)
                    console.log(summary.totaltime)
                    previousTimestamp = currentTrack.timestamp
                }
                journeyJson.journey.push(currentTrack)
                track.journey = true
                track.save(err => {
                    if (err) console.log(err)
                })
            })
            summary.totaltime = (summary.totaltime / 1000.0) + "s"
            journeyJson.summary = summary
            console.log(journeyJson)
            return journeyJson
        } catch (e) {
            console.log(e)
        }
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
        jsonRequest.timestamp = moment().format()
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
        if(this.isDangerous(req.body)){
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
    
    isDangerous(object){
        for (const prop in object) {
            if(typeof(object[prop]) === "object"){
                if(isDangerous(object[prop])){
                    return true
                }
            } else {
                if(typeof(object[prop]) === "string"){
                    var clean = sanitizeHtml(object[prop]);
                    console.log("Clean : " + clean + "   -    origin : " + object[prop])
                    if(clean !== object[prop]) {
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
        jsonResponse.timestamp = moment().format()
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