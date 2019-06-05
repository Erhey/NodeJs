// Use moment to get current timestamp
const moment = require("moment")
const colors = require("colors")

// Getting Request and Response Schema
const RequestSchema = require("./Schema/requestSchema")
const ResponseSchema = require("./Schema/responseSchema")


// Creating Mongoose connection
const mongoose = require('mongoose')
const mongoConnectionStr = 'mongodb://127.0.0.1/tracking'
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
const g_db = mongoose.connection


/**
 * Track Class
 * It defines 2 mains functions : 
 *          Request  :: which track the request and insert a track on request collection
 *          Response :: which track the response and insert a track on response collection
 */
class Track {
    
    /**
     * Constructor
     */
    constructor() {
        if(g_db){
            console.log("Connected to database !".underline.green)
            this.db = g_db
        } else {
            console.log("g_db is undefined".underline.red)
            throw new TypeError("Could not set db attribute as g_db is undefined")
        }
    }

    packageAfficheTest(){
        console.log("je suis bien vivant !! ")
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
        if(req.cookies !== undefined){
            jsonRequest.cookies = req.cookies
        }
        jsonRequest.req = {}
        jsonRequest.req.body = req.body
        console.log(req.body)
        jsonRequest.req.action = req.path
        jsonRequest.req.method = req.method
        this.link_id = new mongoose.Types.ObjectId
        jsonRequest.link_id = this.link_id
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
    createResponseTrack(res ) {
        let jsonResponse = {}
        jsonResponse.timestamp = moment().format()
        if(res.cookies !== undefined){
            jsonResponse.cookies = res.cookies
        }
        jsonResponse.link_id = this.link_id
        if(res.statusCode !== 200) {
            jsonResponse.error = {}
            if(res.error !== undefined) {
                jsonResponse.error.message = res.error.message
                jsonResponse.error.status = res.error.status
                jsonResponse.error.level = res.error.level
                jsonResponse.error.detail = res.error.detail
            }
        }
        jsonResponse.locals = res.locals
        console.log(jsonResponse)
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
module.exports = new Track()