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
        let hour = moment().hour()
        let month = moment().month() + 1    
        let year = moment().year()
        
        this.graph = {
            LIVE: {
                from: moment().startOf('seconds').subtract(1, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().startOf('seconds').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(1, "minutes").asMilliseconds(),
                precision: 60,
                time: [ "-59s", "-58s", "-57s", "-56s", "-55s", "-54s", "-53s", "-52s", "-51s", "-50s", 
                        "-49s", "-48s", "-47s", "-46s", "-45s", "-44s", "-43s", "-42s", "-41s", "-40s", 
                        "-39s", "-38s", "-37s", "-36s", "-35s", "-34s", "-33s", "-32s", "-31s", "-30s", 
                        "-29s", "-28s", "-27s", "-26s", "-25s", "-24s", "-23s", "-22s", "-21s", "-20s", 
                        "-19s", "-18s", "-17s", "-16s", "-15s", "-14s", "-13s", "-12s", "-11s", "-10s", 
                        "-9s", "-8s", "-7s", "-6s", "-5s", "-4s", "-3s", "-2s", "-1s", "live"
                ],
                title : {
                    display : true,
                    text : "LIVE",
                    position : "top",
                    fontSize : 25
                },  
                worksheetNbr : 1
            },
            HOUR: {
                from: moment().startOf('hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(1, "hours").asMilliseconds(),
                precision: 60,
                time: [
                    hour + ":00", hour + ":01", hour + ":02", hour + ":03", hour + ":04", hour + ":05", hour + ":06", hour + ":07", hour + ":08", hour + ":09", 
                    hour + ":10", hour + ":11", hour + ":12", hour + ":13", hour + ":14", hour + ":15", hour + ":16", hour + ":17", hour + ":18", hour + ":19", 
                    hour + ":20", hour + ":21", hour + ":22", hour + ":23", hour + ":24", hour + ":25", hour + ":26", hour + ":27", hour + ":28", hour + ":29", 
                    hour + ":30", hour + ":31", hour + ":32", hour + ":33", hour + ":34", hour + ":35", hour + ":36", hour + ":37", hour + ":38", hour + ":39", 
                    hour + ":40", hour + ":41", hour + ":42", hour + ":43", hour + ":44", hour + ":45", hour + ":46", hour + ":47", hour + ":48", hour + ":49", 
                    hour + ":50", hour + ":51", hour + ":52", hour + ":53", hour + ":54", hour + ":55", hour + ":56", hour + ":57", hour + ":58", hour + ":59"
                ],
                title : {
                    display : true,
                    text : "Last hour",
                    position : "top",
                    fontSize : 25
                },
                worksheetNbr : 1
            },
            DAY: {
                from: moment().startOf('days').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('days').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration:moment.duration(1, "days").asMilliseconds(),
                precision: 48,
                time: [
                    "0:00", "", "1:00", "", "2:00", "", "3:00", "", 
                    "4:00", "", "5:00", "", "6:00", "", "7:00", "", 
                    "8:00", "", "9:00", "", "10:00", "", "11:00", "", 
                    "12:00", "", "13:00", "", "14:00", "", "15:00", "", 
                    "16:00", "", "17:00", "", "18:00", "", "19:00", "", 
                    "20:00", "", "21:00", "", "22:00", "", "23:00", ""
                ],
                title : {
                    display : true,
                    text : moment().format("YYYY MMMM DD"),
                    position : "top",   
                    fontSize : 25
                },
                worksheetNbr : 2
            },
            MONTH: {
                from: moment().startOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('month').diff(moment().startOf('month'))).asMilliseconds(),
                precision: 60,
                time: [
                    "(0" + month + "/01)", "", "(0" + month + "/02)", "", "(0" + month + "/03)", "", "(0" + month + "/04)", "", "(0" + month + "/05)", "", 
                    "(0" + month + "/06)", "", "(0" + month + "/07)", "", "(0" + month + "/08)", "", "(0" + month + "/09)", "", "(0" + month + "/10)", "", 
                    "(0" + month + "/11)", "", "(0" + month + "/12)", "", "(0" + month + "/13)", "", "(0" + month + "/14)", "", "(0" + month + "/15)", "", 
                    "(0" + month + "/16)", "", "(0" + month + "/17)", "", "(0" + month + "/18)", "", "(0" + month + "/19)", "", "(0" + month + "/20)", "", 
                    "(0" + month + "/21)", "", "(0" + month + "/22)", "", "(0" + month + "/23)", "", "(0" + month + "/24)", "", "(0" + month + "/25)", "", 
                    "(0" + month + "/26)", "", "(0" + month + "/27)", "", "(0" + month + "/28)", "", "(0" + month + "/29)", "", "(0" + month + "/30)", ""
                ],
                title : {
                    display : true,
                    text : moment().format("MMMM"),
                    position : "top",
                    fontSize : 25
                },
                worksheetNbr : 3
            },
            YEAR: {
                from: moment().startOf('years').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('years').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(1, "years").asMilliseconds(),
                precision: 48,
                time: [ "January (01/01)", "", "", "",
                        "February (02/01)", "", "", "",
                        "March (03/01)", "", "", "",
                        "April (04/01)", "", "", "",
                        "May (05/01)", "", "", "",
                        "June (06/01)", "", "", "",
                        "July (07/01)", "", "", "",
                        "August (08/01)", "", "", "",
                        "September (09/01)", "", "", "",
                        "October (10/01)", "", "", "",
                        "November (11/01)", "", "", "",
                        "December (12/01)", "", "", ""
                ],
                title : {
                    display : true,
                    text : "Information about year " + moment().year(),
                    position : "top",
                    fontSize : 25
                },
                worksheetNbr : 4
            },
            ALL: {
                from: moment("2015-01-01T00:00:00.000Z").startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('year').diff(moment("2015-01-01T00:00:00.000Z").startOf('year'))).asMilliseconds(),
                precision: 48,
                time:[
                    "2015", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", year, ""
                ],
                title : {
                    display : true,
                    text : "From 2015",
                    position : "top",
                    fontSize : 25
                },
                worksheetNbr : 5
            }
        }
    }
    getGraphFormat(callback){
        let hour = moment().hour()
        let month = moment().month() + 1    
        let dayInMonth = moment().daysInMonth()
        let monthTime = []
        month = 1
        for (let i = 1; i <= dayInMonth; i++) {
            monthTime.push("(" + month + "/" + i + ")")
            monthTime.push("")
        }
            this.graph.MONTH = {
                from: moment().startOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                to: moment().endOf('months').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                duration: moment.duration(moment().endOf('month').diff(moment().startOf('month'))).asMilliseconds(),
                precision: dayInMonth * 2,
                time: monthTime,
                title : {
                    display : true,
                    text : moment().format("MMMM"),
                    position : "top",
                    fontSize : 25
                },
                worksheetNbr : 3
            }
        
        this.graph.HOUR.time = [
            hour + ":00", hour + ":01", hour + ":02", hour + ":03", hour + ":04", hour + ":05", hour + ":06", hour + ":07", hour + ":08", hour + ":09", 
            hour + ":10", hour + ":11", hour + ":12", hour + ":13", hour + ":14", hour + ":15", hour + ":16", hour + ":17", hour + ":18", hour + ":19", 
            hour + ":20", hour + ":21", hour + ":22", hour + ":23", hour + ":24", hour + ":25", hour + ":26", hour + ":27", hour + ":28", hour + ":29", 
            hour + ":30", hour + ":31", hour + ":32", hour + ":33", hour + ":34", hour + ":35", hour + ":36", hour + ":37", hour + ":38", hour + ":39", 
            hour + ":40", hour + ":41", hour + ":42", hour + ":43", hour + ":44", hour + ":45", hour + ":46", hour + ":47", hour + ":48", hour + ":49", 
            hour + ":50", hour + ":51", hour + ":52", hour + ":53", hour + ":54", hour + ":55", hour + ":56", hour + ":57", hour + ":58", hour + ":59"
        ]
        callback(this.graph)
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
        this.graph["LIVE"].from = moment().startOf('seconds').subtract(1, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        this.graph["LIVE"].to = moment().startOf('seconds') .format("YYYY-MM-DDTHH:mm:ss.SSSZ")
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
                            if(graphSpectre[unite].res_time_moy[response.action] === undefined){
                                console.log(graphSpectre[unite].res_time_moy)
                                console.log(response)
                            }
                            graphSpectre[unite].res_time_moy[response.action][indice] += response.restime
                        }
                    })
                }
            })
            registeredAction.forEach(action => {
                for (let indice = 0; indice < range.precision; indice++) {
                    if(graphSpectre[unite].req_count[action][indice] !== 0){
                        graphSpectre[unite].res_time_moy[action][indice] /= graphSpectre[unite].req_count[action][indice]
                    }
                    if(this.graph[unite] === "LIVE"){
                        graphSpectre[unite].multico[action][indice]  = graphSpectre[unite].req_count[action][indice]
                    }
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


