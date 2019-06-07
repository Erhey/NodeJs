// Use moment to get current timestamp
const moment = require("moment")
const colors = require("colors")

// Getting Request and Response Schema
const RequestSchema = require("./Schema/requestSchema")
const ResponseSchema = require("./Schema/responseSchema")
const JourneySchema = require("./Schema/journeySchema")

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
    saveJourney(req) {
        console.log(1)
        let cpt = 0
        let noMoreTracks = false
        let timestamp = moment().valueOf()
        console.log(moment().valueOf() - timestamp)
        // while (!noMoreTracks && (moment().valueOf() - timestamp < 2000)) { // 30s timeout
            // cpt++
            // console.log( moment().valueOf() - timestamp)
            RequestSchema.findOne({ 'req.remoteAddress': req.connection.remoteAddress, journey: false }, (err, track) => {
                console.log("test")
                if (err) {
                    console.log(err)
                }
                if (!track) {
                    console.log("je passe1")
                    // noMoreTracks = true
                } else {
                    console.log("je passe2")
                    // if (track.req !== undefined && track.req[0].cookies !== undefined) {
                    //     try {
                    //         await this.saveJourneyForUserReq(req, track.cookies['user_id'])
                    //     } catch (e) {
                    //         console.log(e)
                    //     }
                    // } else {
                    //     try {
                    //         await this.saveJourneyForUserReq(req, "")
                    //     } catch (e) {
                    //         console.log(e)
                    //     }
                    // }
                    console.log(track)
                    if (track.req !== undefined && track.cookies !== undefined) {
                        console.log("je passe3")
                        this.saveJourneyForUserReq(req, track.cookies['user_id'])
                    } else {
                    console.log("je passe4")
                    this.saveJourneyForUserReq(req, "")
                    }
                }
            })
        // }
    }
    /** 
     * Create a journey for a defined user using request collection
     * 
     * @param {*} req Request informations
     * @param {*} user_id user_id
     */
    saveJourneyForUserReq(req, user_id) {

        let findCond = {}

        RequestSchema.find({'req.remoteAddress': req.connection.remoteAddress, 
                            journey: false, 
                            'cookies.user_id' : user_id }, 
                            [],
                            {
                                sort:{
                                    timestamp: -1 //Sort by Date Added DESC
                                }
                            }, (err, tracks) => {
            if(err) console.log(err)
            if(!tracks) {
            } else {
                let previousTrack
                let currentTrack
                let journeyJson = {}
                if(user_id === '') {
                    journeyJson.user_id = "unknown"
                } else {
                    journeyJson.user_id = user_id
                }
                tracks.forEach(track => {
                    journeyJson.journey = []
                    currentTrack.timestamp = track.timestamp
                    currentTrack.path = track.req.method
                    currentTrack.body = track.req.body
                    if(previousTrack !== undefined) {
                        currentTrack = previousTrack.concat(" > " + currentTrack)
                    }
                    journeyJson.journey.push(currentTrack)
                    previousTrack = currentTrack
                    track.journey = true
                    track.save(err => {
                        if(err) console.log(err)
                    })
                })
                this.insertJourney(journeyJson)
            }
        })
    }
    insertJourney(journeyJson) {
        JourneySchema.insertMany(journeyJson, (err, result) => {
            if (err) {
                console.log(err)
                return false
            } else {
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