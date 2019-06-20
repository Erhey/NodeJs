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




const graphType = {
    ERROR : "error",
    MULTICO : "multico",
    RESTIME : "restime",
    PIRATE : "pirate"
}

class GraphApi {
    constructor() {
        this.graph = {
            HOUR : {
                from: moment().startOf('hour'),
                to: moment().endOf('hour'),
                duration : moment.duration(moment().endOf('hour').diff(moment().startOf('hour'))).asMilliseconds(),
                precision : 60
            },
            DAY : {
                from: moment().startOf('day'),
                to: moment().endOf('day'),
                duration : moment.duration(moment().endOf('day').diff(moment().startOf('day'))).asMilliseconds(),
                precision : 48
            },
            MONTH : {
                from: moment().startOf('month'),
                to: moment().endOf('month'),
                duration : moment.duration(moment().endOf('month').diff(moment().startOf('month'))).asMilliseconds(),
                precision : 60
            },
            YEAR : {
                from: moment().startOf('year'),
                to: moment().endOf('year'),
                duration : moment.duration(moment().endOf('year').diff(moment().startOf('year'))).asMilliseconds(),
                precision : 48
            },
            ALL : {
                from: moment("2015-01-01T00:00:00.000Z").startOf('year'),
                to: moment().endOf('year'),
                duration : moment.duration(moment().endOf('year').diff(moment("2015-01-01T00:00:00.000Z").startOf('year'))).asMilliseconds(),
                precision : 48
            }
        }
    }
    getViewCount(journey){

    }
    getIndiceTS(timestamp, range){
        if( timestamp < range.from || timestamp > range.to ) {
            return -1
        }
        else {
            return Math.ceil( ( ( timestamp - range.from ) / range.duration ) * range.precision )
        }
    }

    async getMultiConnectionAtTime(callback) {
        let graphSpectre = {}
        for (let unite in this.graph) {
            graphSpectre[unite] = {}
            let range = this.graph[unite]
            periodCond = { $and: [ {"summary.to" : { $not: { $lt: range.from } } }, {"summary.from": { $not :{ $gte: range.to } } } ] }
            await JourneySchema.find(periodCond, async (err, journeys) => {
                await journeys.forEach(journey => {
                    let indice = this.getIndiceTS(journey.timestamp, range)
                    if (indice !== -1) {
                        if(graphSpectre[unite][journey.req.action] === undefined) {
                            graphSpectre[unite][journey.req.action] = {}
                            graphSpectre[unite][journey.req.action].req_count = []
                            graphSpectre[unite][journey.req.action].error_count = []
                            graphSpectre[unite][journey.req.action].dangerous_count = []
                            // graphSpectre[unite][journey.req.action].unique_visitor_count = []
                            graphSpectre[unite][journey.req.action].res_time_count = []
                            graphSpectre[unite][journey.req.action].multico = []
                        }
                        // req count
                        graphSpectre[unite][journey.req.action].req_count[indice]++
                        if(journey.res.error !== undefined) {
                            graphSpectre[unite][journey.req.action].error_count[indice]++
                        }
                        if(journey.isDangerous){
                            graphSpectre[unite][journey.req.action].dangerous_count[indice]++
                        }
                        // res time count
                        graphSpectre[unite][journey.req.action].res_time_count[indice] += journey.res.restime
                    }
                })
            
                for (let page in graphSpectre[unite]) {
                    for(let indice = 0; indice < range.precision; i++){
                        graphSpectre[unite][page].res_time_count[indice] /= graphSpectre[unite][journey.req.action].req_count[indice]
                        graphSpectre[unite][journey.req.action].multico = []
                        graphSpectre[unite][page].multico[indice] += graphSpectre[unite][page].req_count[indice]
                        if(indice !== 0){
                            graphSpectre[unite][page].req_count[indice] += graphSpectre[unite][page].req_count[ indice - 1 ]
                            graphSpectre[unite][page].dangerous_count[indice] += graphSpectre[unite][page].dangerous_count[ indice - 1 ]
                        }
                    }
                }
            })
        }
    }

}

module.exports = new GraphApi()


