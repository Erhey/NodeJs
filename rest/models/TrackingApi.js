
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
    /**
     * Look for dangerous requests such as <script>alert('you got pirated')</script>
     * 
     * @param {*} from From when should we look for dangerous request
     * @param {*} callback 
     */
    async getDangerousRequests(from=undefined, callback) {
        let findCond
        if(from) {
            findCond = { "timestamp": { $gte: from }, isDangerous : true }
        } else {
            findCond = { isDangerous : true }
        }
        console.log(findCond)
        console.log("test")
        await RequestSchema.find(findCond, (err, result) => {
            if (err) console.log(err)
            if (result) {
                let requests = []
                console.log(result)
                for(let i = 0; i < result.length; i++){
                    let curRequest = {}
                    curRequest.body = result[i].req.body
                    curRequest.user_info = result[i].cookies
                    curRequest.timestamp = result[i].timestamp
                    requests.push(curRequest)
                    console.log("je passe2")
                }
                console.log("je passe")
                callback(requests)
            }
        })
    }
    async countDangerousRequests(from=undefined, to=undefined, callback) {
        let findCond
        if(from) {
            findCond = { "timestamp": { $gte: from }, isDangerous : true }
        } else {
            findCond = { isDangerous : true }
        }
        console.log(findCond)
        console.log("test")
        await RequestSchema.count(findCond, (err, result) => {
            if (err) console.log(err)
            if (result) {
                callback(result)
            }
        })
    }
    // async getReqNumber(page, from, to, callback) {
    //     let findCond
    //     if(from) {
    //         findCond = { "timestamp": { $gte: from }}
    //     } else {
    //         findCond = {}
    //     }
    //     console.log(findCond)
    //     console.log("test")
    //     await RequestSchema.find(findCond, (err, result) => {
    //         if (err) console.log(err)
    //         if (result) {
    //             let requests = []
    //             console.log(result)
    //             for(let i = 0; i < result.length; i++){
    //                 let curRequest = {}
    //                 curRequest.body = result[i].req.body
    //                 curRequest.user_info = result[i].cookies
    //                 curRequest.timestamp = result[i].timestamp
    //                 requests.push(curRequest)
    //                 console.log("je passe2")
    //             }
    //             console.log("je passe")
    //             callback(requests)
    //         }
    //     })

    // }

    // async getPageInfos(page, from, to){
    //     info :{
    //         req: {
    //             total_req_nbr :       Request
    //             page_req_nbr:        Request
    //             purcent_shared :     計算
    //             danger_req_nbr :Request
    //             danger_req_rate:計算
    //         }    
    //         conn_length : {     Journey
    //             min :           計算
    //             moy :           計算
    //             max :           計算
    //         }
    //         res : {
    //             error_nbr :         Response
    //             error_rate :        計算
    //             response_time : {   Response
    //                 min :           計算
    //                 moy :           計算
    //                 max :           計算
    //             }
    //         }
    //         multi_conn : {          Journey
    //             min :           計算
    //             moy :           計算
    //             max :           計算
    //         }
    //     }
    //     let info = {}
    //     info.req = {}
    //     info.req.page_req_nbr = await getReqNumber(page, from, to, result => {
    //         return result
    //     })
    //     info.req.total_req_nbr = await getReqNumber(undefined, from, to, callback)
    //     info.req.purcent_shared =  Math.floor((info.req.page_req_nbr / info.req.total_req_nbr) * 100) + "%"
    //     info.req.danger_req_nbr = await countDangerousRequests(from, to, callback)
    //     info.req.danger_req_rate = countDangerousRequests(from, to, callback))
    //     let findCond
    //     if(from) {
    //         findCond = { "timestamp": { $gte: from }, isDangerous : true }
    //     } else {
    //         findCond = { isDangerous : true }
    //     }
    //     console.log(findCond)
    //     console.log("test")
    //     await RequestSchema.find(findCond, (err, result) => {
    //         if (err) console.log(err)
    //         if (result) {
    //             let requests = []
    //             console.log(result)
    //             for(let i = 0; i < result.length; i++){
    //                 let curRequest = {}
    //                 curRequest.body = result[i].req.body
    //                 curRequest.user_info = result[i].cookies
    //                 curRequest.timestamp = result[i].timestamp
    //                 requests.push(curRequest)
    //                 console.log("je passe2")
    //             }
    //             console.log("je passe")
    //             callback(requests)
    //         }
    //     })
    // }
    getMostViewedPageOnPlage(){
        return false
    }
    getLessViewedPageOnPlage(){
        return false
    }
}

module.exports = new TrackingApi()