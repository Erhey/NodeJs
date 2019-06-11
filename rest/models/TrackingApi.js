
const JourneySchema = require("../track/Schema/journeySchema")
const RequestSchema = require("../track/Schema/requestSchema")
const moment = require("moment")
const mongoose = require('mongoose')
const colors = require("colors")
const mongoConnectionStr = 'mongodb://127.0.0.1/tracking'
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
const g_db = mongoose.connection

class TrackingApi {
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

    getMultiConnectionAtTime(timestamp, currentTimestamp, callback) {
        let findCond = {}
        findCond = { "from": { $lt: timestamp }, "to": { $gte: timestamp } }
        JourneySchema.count(findCond, (err, nbrConnections) => {
            if (err) console.log(err)
            if (nbrConnections) {
                callback(nbrConnections)
            }
        })
    }
    /**
     * 
     * @param {*} from 
     * @param {*} to 
     * @param {*} precision Defines the precision 
     * @param {*} callback 
     */
    getMultiConnectionRange(from, to, precision = 20, callback) {
        let currentTimestamp
        let multiconnectionGraph = []
        for (let i = 0; i < precision; i++) {
            currentTimestamp = from + ((to - from) / precision)
            multiconnectionGraph.push(getMultiConnectionAtTime(currentTimestamp, callback))
        }
        return multiconnectionGraph
    }
    getDangerousRequests(from=undefined, callback) {
        let findCond
        if(from) {
            findCond = { "from": { $gte: from }, isDangerous : true }
        } else {
            findCond = { isDangerous : true }
        }
        RequestSchema.find(findCond, (err, result) => {
            if (err) console.log(err)
            if (result) {
                console.log(result)
            }
        })
    }
}

module.exports = new TrackingApi()