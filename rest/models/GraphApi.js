const JourneySchema = require("../track/Schema/journeySchema")
const RequestSchema = require("../track/Schema/requestSchema")
const ResponseSchema = require("../track/Schema/responseSchema")
const moment = require("moment")
const mongoose = require('mongoose')
const colors = require("colors")
const mongoConnectionStr = 'mongodb://127.0.0.1/tracking'
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
const g_db = mongoose.connection


const period = {
    HOUR : "hour",
    TODAY : "today",
    DAY : "day",
    MONTH : "month",
    YEAR : "year",
    ALL : "all"
}

const graphType = {
    ERROR : "error",
    MULTICO : "multico",
    RESTIME : "restime",
    PIRATE : "pirate"
}


class GraphApi {

    getPrecision(period) {
        let precision = ""
        switch (period) {
            case period.HOUR:
                precision = 60
            case period.TODAY:
                precision = 48
            case period.DAY:
                precision = 48
            case period.MONTH:
                precision = 60
            case period.YEAR:
                precision = 48
            case period.ALL:
                precision = 48 * this.nbrYears
        }
        return precision
    }
    getErrorAtTime(timestamp, callback) {
        
    }
    async getMultiConnectionAtTime(timestamp, callback) {
        let findCond = {}
        findCond = { "summary.from": { $lt: timestamp }, "summary.to": { $gte: timestamp } }
        await JourneySchema.countDocuments(findCond, (err, nbrConnections) => {
            if (err) console.log(err)
            callback(nbrConnections)
        })
    }
    getErrorGraph(timestamp, period, callback) {

    }


}

module.exports = new GraphApi()


