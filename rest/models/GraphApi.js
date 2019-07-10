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

const Excel = require('exceljs')


class GraphApi {
    constructor() {
        this.graph = {
            LIVE: {
                from: moment().subtract(1, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(1, "minutes").asMilliseconds(),
                precision: 60,
                time: [ "-59s", "-58s", "-57s", "-56s", "-55s", "-54s", "-53s", "-52s", "-51s", "-50s", 
                        "-49s", "-48s", "-47s", "-46s", "-45s", "-44s", "-43s", "-42s", "-41s", "-40s", 
                        "-39s", "-38s", "-37s", "-36s", "-35s", "-34s", "-33s", "-32s", "-31s", "-30s", 
                        "-29s", "-28s", "-27s", "-26s", "-25s", "-24s", "-23s", "-22s", "-21s", "-20s", 
                        "-19s", "-18s", "-17s", "-16s", "-15s", "-14s", "-13s", "-12s", "-11s", "-10s", 
                        "-9s", "-8s", "-7s", "-6s", "-5s", "-4s", "-3s", "-2s", "-1s", "live"
                ],
                worksheetNbr : 1
            },
            HOUR: {
                from: moment().startOf('hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(1, "hours").asMilliseconds(),
                precision: 60,
                time: [
                    "0:00", "0:01", "0:02", "0:03", "0:04", "0:05", "0:06", "0:07", "0:08", "0:09", 
                    "0:10", "0:11", "0:12", "0:13", "0:14", "0:15", "0:16", "0:17", "0:18", "0:19", 
                    "0:20", "0:21", "0:22", "0:23", "0:24", "0:25", "0:26", "0:27", "0:28", "0:29", 
                    "0:30", "0:31", "0:32", "0:33", "0:34", "0:35", "0:36", "0:37", "0:38", "0:39", 
                    "0:40", "0:41", "0:42", "0:43", "0:44", "0:45", "0:46", "0:47", "0:48", "0:49", 
                    "0:50", "0:51", "0:52", "0:53", "0:54", "0:55", "0:56", "0:57", "0:58", "0:59"
                ],
                worksheetNbr : 1
            },
            DAY: {
                from: moment().startOf('days').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('days').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration:moment.duration(1, "days").asMilliseconds(),
                precision: 48,
                time: [
                    "0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", 
                    "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", 
                    "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", 
                    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
                    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
                    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
                ],
                worksheetNbr : 2
            },
            MONTH: {
                from: moment().startOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('month').diff(moment().startOf('month'))).asMilliseconds(),
                precision: 60,
                time: [
                    "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", 
                    "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", 
                    "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", 
                    "15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5", "19", "19.5", 
                    "20", "20.5", "21", "21.5", "22", "22.5", "23", "23.5", "24", "24.5", 
                    "25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29", "29.5"
                ],
                worksheetNbr : 3
            },
            YEAR: {
                from: moment().startOf('years').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('years').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(1, "years").asMilliseconds(),
                precision: 48,
                time: [
                    "0", "0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", 
                    "2", "2.25", "2.5", "2.75", "3", "3.25", "3.5", "3.75", 
                    "4", "4.25", "4.5", "4.75", "5", "5.25", "5.5", "5.75", 
                    "6", "6.25", "6.5", "6.75", "7", "7.25", "7.5", "7.75", 
                    "8", "8.25", "8.5", "8.75", "9", "9.25", "9.5", "9.75", 
                    "10", "10.25", "10.5", "10.75", "11", "11.25", "11.5", "11.75"
                ],
                worksheetNbr : 4
            },
            ALL: {
                from: moment("2015-01-01T00:00:00.000Z").startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('year').diff(moment("2015-01-01T00:00:00.000Z").startOf('year'))).asMilliseconds(),
                precision: 48,
                time:[
                    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                    "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                    "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
                    "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
                    "40", "41", "42", "43", "44", "45", "46", "47"
                ],
                worksheetNbr : 5
            }
        }

    }
    getIndiceTS(timestamp, range) {
        if (timestamp < range.from || timestamp > range.to) {
            return -1
        }
        else {
            return Math.ceil(((moment(timestamp).diff(moment(range.from))) / range.duration) * range.precision)
        }
    }
    async updateGraphFromTo() {
        this.graph["LIVE"].from = moment().subtract(1, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["LIVE"].to = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["HOUR"].from = moment().startOf('hour').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["HOUR"].to = moment().endOf('hour').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["DAY"].from = moment().startOf('days').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["DAY"].to = moment().endOf('days').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["MONTH"].from = moment().startOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["MONTH"].to = moment().endOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["YEAR"].from = moment().startOf('years').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["YEAR"].to = moment().endOf('years').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["ALL"].from = moment("2015-01-01T00:00:00.000Z").startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["ALL"].to = moment().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    }

    async getMaximumMultico(){

    }

    async getLiveInfo(callback) {
        await this.updateGraphFromTo()
        let graphSpectre = {}
        let registeredAction = []
        for (let unite in this.graph) {
            graphSpectre[unite] = {}
            graphSpectre[unite].req_count = {}
            graphSpectre[unite].error_count = {}
            graphSpectre[unite].dangerous_count = {}
            graphSpectre[unite].res_time_moy = {}
            if(this.graph[unite] === "LIVE"){
                graphSpectre[unite].multico = {}
            }
        }
        // console.log(graphSpectre)
        for (let unite in this.graph) {
            let range = this.graph[unite]
            let periodCond = { "timestamp": { $gte: range.from, $lt: range.to } }
            console.log("from : " + range.from)
            console.log("to : " + range.to)
            await RequestSchema.find(periodCond, async (err, requests) => {
                if (requests !== undefined) {
                    await requests.forEach(request => {
                        let indice = this.getIndiceTS(request.timestamp, range)
                        if (indice !== -1) {
                            let i = 0
                            let iMax
                            if(!registeredAction.includes(request.req.action)){
                                // console.log(registeredAction)
                                registeredAction.push(request.req.action)
                                for (let l_unite in this.graph) {
                                    i = 0
                                    // console.log(graphSpectre)
                                    iMax = this.graph[l_unite].precision
                                    graphSpectre[l_unite].req_count[request.req.action] = []
                                    graphSpectre[l_unite].error_count[request.req.action] = []
                                    graphSpectre[l_unite].dangerous_count[request.req.action] = []
                                    graphSpectre[l_unite].res_time_moy[request.req.action] = []
                                    if(this.graph[l_unite] === "LIVE"){
                                        graphSpectre[l_unite].multico[request.req.action] = []
                                        for(; i < iMax; i++){
                                            graphSpectre[l_unite].req_count[request.req.action][i] = 0
                                            graphSpectre[l_unite].error_count[request.req.action][i] = 0
                                            graphSpectre[l_unite].dangerous_count[request.req.action][i] = 0
                                            graphSpectre[l_unite].res_time_moy[request.req.action][i] = 0
                                            graphSpectre[l_unite].multico[request.req.action][i] = 0
                                        }
                                    } else {
                                        for(; i < iMax; i++){
                                            graphSpectre[l_unite].req_count[request.req.action][i] = 0
                                            graphSpectre[l_unite].error_count[request.req.action][i] = 0
                                            graphSpectre[l_unite].dangerous_count[request.req.action][i] = 0
                                            graphSpectre[l_unite].res_time_moy[request.req.action][i] = 0
                                        }
                                    }
                                }
                            }
                            // console.log(graphSpectre[unite])
                            graphSpectre[unite].req_count[request.req.action][indice]++
                            // if (request.res.error !== undefined) {
                            //     graphSpectre[unite].error_count[request.req.action][indice]++
                            // }
                            if (request.isDangerous) {
                                graphSpectre[unite].dangerous_count[request.req.action][indice]++
                            }
                            // res time count
                            // graphSpectre[unite].res_time_moy[request.req.action][indice] += request.res.restime
                        }
                    })
                }
            })
            await ResponseSchema.find(periodCond, async (err, responses) => {
                if (responses !== undefined) {
                    await responses.forEach(async response => {
                        let indice = this.getIndiceTS(response.timestamp, range)
                        if (indice !== -1) {
                            if (response.error !== undefined) {
                                graphSpectre[unite].error_count[response.action][indice]++
                            }
                            // res time count
                            graphSpectre[unite].res_time_moy[response.action][indice] += response.restime
                        }
                    })
                }
            })
        }

            // registeredAction.forEach(action => {
            //     for (let indice = 0; indice < range.precision; indice++) {
            //         if(graphSpectre[unite].req_count[action][indice] !== 0){
            //             graphSpectre[unite].res_time_moy[action][indice] /= graphSpectre[unite].req_count[action][indice]
            //         }
            //         if(this.graph[unite] === "LIVE"){
            //             graphSpectre[unite].multico[action][indice]  = graphSpectre[unite].req_count[action][indice]
            //         }
            //         // if (indice !== 0) {
            //         //     graphSpectre[unite].req_count[action][indice] += graphSpectre[unite].req_count[action][indice - 1]
            //         //     graphSpectre[unite].dangerous_count[action][indice] += graphSpectre[unite].dangerous_count[action][indice - 1]
            //         //     graphSpectre[unite].error_count[action][indice] += graphSpectre[unite].error_count[action][indice - 1]
            //         // }
            //     }
            // })
        callback(graphSpectre)
    }





    async getGraphInfoGrouped(callback) {
        await this.updateGraphFromTo()
        let graphSpectre = {}
        let registeredAction = []
                
        for (let unite in this.graph) {
            
            graphSpectre[unite] = {}
            graphSpectre[unite].req_count = {}
            graphSpectre[unite].error_count = {}
            graphSpectre[unite].dangerous_count = {}
            graphSpectre[unite].res_time_moy = {}
            if(this.graph[unite] === "LIVE"){
                graphSpectre[unite].multico = {}
            }
        }
        for (let unite in this.graph) {
            // console.log(unite)
            let range = this.graph[unite]
            let periodCond = { "summary.to": { $not: { $lt: range.from } }, "summary.from": { $not: { $gte: range.to } } }
            // console.log("from : " + range.from)
            // console.log("to : " + range.to)
            await JourneySchema.find(periodCond, async (err, results) => {
                // graphSpectre[unite][journey.req.action].unique_visitor_count = []
                // console.log(results[0].journey)
                
                if (results !== undefined) {
                    await results.forEach(async result => {
                        await result.journey.forEach(track => {
                            let indice = this.getIndiceTS(track.timestamp, range)
                            if (indice !== -1) {
                                let i = 0
                                let iMax
                                if(!registeredAction.includes(track.req.action)){
                                    // console.log(registeredAction)
                                    registeredAction.push(track.req.action)
                                    for (let l_unite in this.graph) {
                                        i = 0
                                        // console.log(l_unite)
                                        iMax = this.graph[l_unite].precision
                                        graphSpectre[l_unite].req_count[track.req.action] = []
                                        graphSpectre[l_unite].error_count[track.req.action] = []
                                        graphSpectre[l_unite].dangerous_count[track.req.action] = []
                                        graphSpectre[l_unite].res_time_moy[track.req.action] = []
                                        if(this.graph[l_unite] === "LIVE"){
                                            graphSpectre[l_unite].multico[track.req.action] = []
                                            for(; i < iMax; i++){
                                                graphSpectre[l_unite].req_count[track.req.action][i] = 0
                                                graphSpectre[l_unite].error_count[track.req.action][i] = 0
                                                graphSpectre[l_unite].dangerous_count[track.req.action][i] = 0
                                                graphSpectre[l_unite].res_time_moy[track.req.action][i] = 0
                                                graphSpectre[l_unite].multico[track.req.action][i] = 0
                                            }
                                        } else {
                                            for(; i < iMax; i++){
                                                graphSpectre[l_unite].req_count[track.req.action][i] = 0
                                                graphSpectre[l_unite].error_count[track.req.action][i] = 0
                                                graphSpectre[l_unite].dangerous_count[track.req.action][i] = 0
                                                graphSpectre[l_unite].res_time_moy[track.req.action][i] = 0
                                            }
                                        }
                                    }
                                }
                                // console.log(graphSpectre[unite])
                                graphSpectre[unite].req_count[track.req.action][indice]++
                                if (track.res.error !== undefined) {
                                    graphSpectre[unite].error_count[track.req.action][indice]++
                                }
                                if (track.isDangerous) {
                                    graphSpectre[unite].dangerous_count[track.req.action][indice]++
                                }
                                // res time count
                                graphSpectre[unite].res_time_moy[track.req.action][indice] += track.res.restime
                            }
                        })
                    })
                    registeredAction.forEach(action => {
                        for (let indice = 0; indice < range.precision; indice++) {
                            if(graphSpectre[unite].req_count[action][indice] !== 0){
                                graphSpectre[unite].res_time_moy[action][indice] /= graphSpectre[unite].req_count[action][indice]
                            }
                            if(this.graph[unite] === "LIVE"){
                                graphSpectre[unite].multico[action][indice]  = graphSpectre[unite].req_count[action][indice]
                            }
                            // if (indice !== 0) {
                            //     graphSpectre[unite].req_count[action][indice] += graphSpectre[unite].req_count[action][indice - 1]
                            //     graphSpectre[unite].dangerous_count[action][indice] += graphSpectre[unite].dangerous_count[action][indice - 1]
                            //     graphSpectre[unite].error_count[action][indice] += graphSpectre[unite].error_count[action][indice - 1]
                            // }
                        }
                    })
                }
            })
        }
        callback(graphSpectre)
    }
    async getGraphActionGrouped(callback) {
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
                            if (indice !== -1) {
                                if (graphSpectre[unite][track.req.action] === undefined) {
                                    graphSpectre[unite][track.req.action] = {}
                                    graphSpectre[unite][track.req.action].req_count = []
                                    graphSpectre[unite][track.req.action].error_count = []
                                    graphSpectre[unite][track.req.action].dangerous_count = []
                                    graphSpectre[unite][track.req.action].res_time_moy = []
                                    if(this.graph[unite] === "LIVE"){
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
                                    if(this.graph[unite] === "LIVE"){
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
                            if(this.graph[unite] === "LIVE"){
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
        callback(graphSpectre)
    }
    // updateExcel(graphSpectre, callback) {
    //     let workbook = new Excel.Workbook()
    //     let rowNbr = 0
    //     let row = {}
    //     workbook.xlsx.readFile('./excel/analytics.xlsx').then(() => {
    //         for (let unite in this.graph) {
    //             let worksheet = workbook.getWorksheet(this.graph[unite].worksheetNbr)
    //             for (let info in graphSpectre[unite]){
    //                 rowNbr++
    //                 row = worksheet.getRow(rowNbr)
    //                 row.values = ["time"].concat(this.graph[unite].time)
    //                 for (let action in graphSpectre[unite][info]) {
    //                 rowNbr++
    //                 row = worksheet.getRow(rowNbr)
    //                 row.values = [action].concat(graphSpectre[unite][info][action])
    //                 }
    //                 rowNbr++
    //                 row = worksheet.getRow(rowNbr)
    //                 row.values = [
    //                     "--------------------------------------------------------------------------" + 
    //                     "--------------------------------------------------------------------------" + 
    //                     "--------------------------------------------------------------------------" + 
    //                     "--------------------------------------------------------------------------" 
    //                 ]
    //             }
    //             rowNbr = 0
    //         }
    //         workbook.xlsx.writeFile('./excel/analytics.xlsx').then(function() {
    //             console.log("saved")
    //         }) 
    //     })
        
    //     callback("Done")
    // }
}

module.exports = new GraphApi()


