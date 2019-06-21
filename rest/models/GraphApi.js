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



class GraphApi {
    constructor() {
        this.graph = {
            HOUR: {
                from: moment().startOf('hour').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('hour').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('hour').diff(moment().startOf('hour'))).asMilliseconds(),
                precision: 60
            },
            DAY: {
                from: moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('day').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('day').diff(moment().startOf('day'))).asMilliseconds(),
                precision: 48
            },
            MONTH: {
                from: moment().startOf('month').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('month').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('month').diff(moment().startOf('month'))).asMilliseconds(),
                precision: 60
            },
            YEAR: {
                from: moment().startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('year').diff(moment().startOf('year'))).asMilliseconds(),
                precision: 48
            },
            ALL: {
                from: moment("2015-01-01T00:00:00.000Z").startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('year').diff(moment("2015-01-01T00:00:00.000Z").startOf('year'))).asMilliseconds(),
                precision: 48
            }
        }
    }
    getViewCount(journey) {

    }
    getIndiceTS(timestamp, range) {
        if (timestamp < range.from || timestamp > range.to) {
            return -1
        }
        else {
            return Math.ceil(((moment(timestamp).diff(moment(range.from))) / range.duration) * range.precision)
        }
    }

    async getGraph(callback) {
        let test = 0
        let graphSpectre = {}
        for (let unite in this.graph) {
            console.log(unite)
            graphSpectre[unite] = {}
            let range = this.graph[unite]
            let periodCond = { "summary.to": { $not: { $lt: range.from } }, "summary.from": { $not: { $gte: range.to } } }
            console.log("from : " + range.from)
            console.log("to : " + range.to)
            await JourneySchema.find(periodCond, async (err, results) => {
                // graphSpectre[unite][journey.req.action].unique_visitor_count = []
                // console.log(results[0].journey)
                if (results !== undefined) {
                    await results.forEach(async result => {
                        await result.journey.forEach(track => {
                            let indice = this.getIndiceTS(track.timestamp, range)
                            console.log("indice : " + indice)
                            if (indice !== -1) {
                                if (graphSpectre[unite][track.req.action] === undefined) {
                                    graphSpectre[unite][track.req.action] = {}
                                    graphSpectre[unite][track.req.action].req_count = []
                                    graphSpectre[unite][track.req.action].error_count = []
                                    graphSpectre[unite][track.req.action].dangerous_count = []
                                    graphSpectre[unite][track.req.action].res_time_moy = []
                                    if(this.graph[unite] === "HOUR"){
                                        graphSpectre[unite][track.req.action].multico = []
                                    }
                                    let i = 0
                                    const iMax = range.precision
                                    for(; i < iMax; i++){
                                        graphSpectre[unite][track.req.action].req_count[i] = 0
                                        graphSpectre[unite][track.req.action].error_count[i] = 0
                                        graphSpectre[unite][track.req.action].dangerous_count[i] = 0
                                        graphSpectre[unite][track.req.action].res_time_moy[i] = 0
                                    }
                                    if(this.graph[unite] === "HOUR"){
                                        i = 0
                                        for(; i < iMax; i++){
                                            graphSpectre[unite][track.req.action].multico[i] = 0
                                        }
                                    }
                                }
                                graphSpectre[unite][track.req.action].req_count[indice]++
                                if (track.res.error !== undefined) {
                                    graphSpectre[unite][track.req.action].error_count[indice]++
                                }
                                if (track.isDangerous) {
                                    graphSpectre[unite][track.req.action].dangerous_count[indice]++
                                }
                                // res time count
                                graphSpectre[unite][track.req.action].res_time_moy[indice] += track.res.restime
                            }
                        })
                    })
                    for (let page in graphSpectre[unite]) {
                        for (let indice = 0; indice < range.precision; indice++) {
                            if(graphSpectre[unite][page].req_count[indice] !== 0){
                                graphSpectre[unite][page].res_time_moy[indice] /= graphSpectre[unite][page].req_count[indice]
                            }
                            if(this.graph[unite] === "HOUR"){
                                graphSpectre[unite][page].multico[indice]  = graphSpectre[unite][page].req_count[indice]
                            }
                            if (indice !== 0) {
                                graphSpectre[unite][page].req_count[indice] += graphSpectre[unite][page].req_count[indice - 1]
                                graphSpectre[unite][page].dangerous_count[indice] += graphSpectre[unite][page].dangerous_count[indice - 1]
                                graphSpectre[unite][page].error_count[indice] += graphSpectre[unite][page].error_count[indice - 1]
                                
                            }
                        }
                    }
                }
            })
        }
        console.log(test)
        callback(graphSpectre)
    }

}

module.exports = new GraphApi()


