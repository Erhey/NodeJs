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

がいよう
class GraphApi {

    getPrecision(period) {
        let precision = ""
        switch (period) {
            case period.HOUR:
                precision = 60
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
    getRange(period){
        let displayRange = {}
        switch (period) {
            case period.HOUR:
                displayRange = {
                    from: moment().startOf('hour'),
                    to: moment().endOf('hour'),
                    duration : moment.duration(moment().endOf('hour').diff(moment().startOf('hour'))).asMilliseconds()
                }
            case period.DAY:
                displayRange = {
                    from: moment().startOf('day'),
                    to: moment().endOf('day'),
                    duration : moment.duration(moment().endOf('day').diff(moment().startOf('day'))).asMilliseconds()
                }
            case period.MONTH:
                displayRange = {
                    from: moment().startOf('month'),
                    to: moment().endOf('month'),
                    duration : moment.duration(moment().endOf('month').diff(moment().startOf('month'))).asMilliseconds()
                }
            case period.YEAR:
                displayRange = {
                    from: moment().startOf('year'),
                    to: moment().endOf('year'),
                    duration : moment.duration(moment().endOf('year').diff(moment().startOf('year'))).asMilliseconds()
                }
            case period.ALL:
                displayRange = {
                    from: moment("2015-01-01T00:00:00.000Z").startOf('year'),
                    to: moment().endOf('year'),
                    duration : moment.duration(moment().endOf('year').diff(moment().startOf('year'))).asMilliseconds()
                }
        }
        return displayRange
    }
    getViewCount(journey){

    }


    async getMultiConnectionAtTime(callback) {
        for (let unite in period) {
            for (let i = 0; i < precision; i++) {
                timestamp = moment(displayRange.from).add((i * displayRange.duration) / precision)
                countCond = { $and: [ {"summary.to" : { $not: { $lt: displayRange.from } } }, {"summary.from": { $not :{ $gte: timestamp } } } ] }
                timeStampCond = { "summary.from": { $lt: timestamp }, "summary.to": { $gte: timestamp } }, async (err, results) => {

                // [0 ... X]
                await JourneySchema.find(
                    if(err) {
                        console.log(err)
                    } else {
                // [Y ... X]

            }

            graphCond = { $and: [ {"summary.to" : { $not: { $lt: range.from } } }, {"summary.from": { $not :{ $gte: range.to } } } ] }
            await JourneySchema.find(findJourneyCond, async (err, results) => {
                if(err) {
                    console.log(err)
                } else {
                    await results.forEach(async result => {
                        if(!uniqueVisitor.includes(result.user_id)) {
                            uniqueVisitor.push(result.user_id)
                        }
                        visitors++
                        await result.journey.forEach(track => {
                            if(moment(track.timestamp) > moment(from) && moment(track.timestamp) < moment(to)){
        let diffFromTo = moment.duration(moment(to).diff(moment(from))).asMilliseconds()
        for (let i = 0; i < precision; i++) {
            timestamp = moment(from).add((i * diffFromTo) / precision)
            await this.getMultiConnectionAtTime(timestamp, nbrConnections => {
                spectrum.push({ "nbr": nbrConnections, "timestamp": timestamp })
            })
        }
        }
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


