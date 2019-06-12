
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
    async getMultiConnectionAtTime(timestamp, callback) {
        let findCond = {}
        findCond = { "summary.from" : { $lt: timestamp }, "summary.to": { $gte: timestamp } }
        await JourneySchema.countDocuments(findCond, (err, nbrConnections) => {
            if (err) console.log(err)
                callback(nbrConnections)
        })
    }
    /**
     * 
     * @param {*} from 
     * @param {*} to 
     * @param {*} precision Defines the precision 
     * @param {*} callback 
     */
    async getMultiConnectionRange(from, to, precision, callback) {
        let spectrum = []
        let timestamp
        let diffFromTo = moment.duration(moment(to).diff(moment(from))).asMilliseconds()
        for (let i = 0; i < precision; i++) {
            timestamp = moment(from).add( ( i * diffFromTo) / precision )
            await this.getMultiConnectionAtTime(timestamp,nbrConnections => {
                spectrum.push({"nbr" : nbrConnections, "timestamp" : timestamp})
            })
        }
        callback(spectrum)
    }


    ////// TODO:
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
    getHowLongOnPage(){
        return false
    }
    getMostViewedPageOnPlage(){
        return false
    }
    getLessViewedPageOnPlage(){
        return false
    }
}

module.exports = new TrackingApi()