
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
        findCond = { "summary.from": { $lt: timestamp }, "summary.to": { $gte: timestamp } }
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
            timestamp = moment(from).add((i * diffFromTo) / precision)
            await this.getMultiConnectionAtTime(timestamp, nbrConnections => {
                spectrum.push({ "nbr": nbrConnections, "timestamp": timestamp })
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
    async getDangerousRequests(from = undefined, callback) {
        let findCond
        if (from) {
            findCond = { "timestamp": { $gte: from }, isDangerous: true }
        } else {
            findCond = { isDangerous: true }
        }
        console.log(findCond)
        console.log("test")
        await RequestSchema.find(findCond, (err, result) => {
            if (err) console.log(err)
            if (result) {
                let requests = []
                console.log(result)
                for (let i = 0; i < result.length; i++) {
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

    async getPagesVisitedList(from, to, callback){
        let pageVisitedList = []
        let findCond = { timestamp: { $gte: from }, timestamp: { $lt: to } }
        await RequestSchema.find(findCond, async (err, requests) => {
            if(err) {
                console.log(err)
            } else {
                await requests.forEach(request => {
                    if (!pageVisitedList.includes(request.req.action)){
                        pageVisitedList.push(request.req.action)
                    }
                })
            }
        })
        callback(pageVisitedList)
    }
    async getPagesInfo(from, to, page_name, callback) {
        let uniqueVisitor = []
        let reqCount = 0
        let visitors = 0
        let returnedValue = {}
        returnedValue.pages = {}
        let findJourneyCond = { $and: [{"summary.to" : { $not: { $lt: from }}}, {"summary.from": {$not :{ $gte: to }}} ] }
        await JourneySchema.find(findJourneyCond, async (err, results) => {
            if(err) {
                console.log(err)
            } else {
                // console.log(results)
                await results.forEach(async result => {
                    if(!uniqueVisitor.includes(result.user_id)) {
                        uniqueVisitor.push(result.user_id)
                    }
                    visitors++
                    await result.journey.forEach(track => {
                        if(moment(track.timestamp) > moment(from) && moment(track.timestamp) < moment(to)){
                            if(returnedValue.pages[track.currentPath] === undefined){
                                returnedValue.pages[track.currentPath] = {}
                                returnedValue.pages[track.currentPath].conn_length = {}
                                returnedValue.pages[track.currentPath].conn_length.moy = 0
                                returnedValue.pages[track.currentPath].res = {}
                                returnedValue.pages[track.currentPath].res.moy = 0
                                returnedValue.pages[track.currentPath].req = {}
                                returnedValue.pages[track.currentPath].req.total_count = 0
                                returnedValue.pages[track.currentPath].req.danger = {}
                                returnedValue.pages[track.currentPath].req.danger.total_count = 0
                                returnedValue.pages[track.currentPath].req.danger.list = []
                            }
                            returnedValue.pages[track.currentPath].req.total_count++
                            reqCount++
                            // conn_length > min
                            if(returnedValue.pages[track.currentPath].conn_length.min === undefined || 
                                returnedValue.pages[track.currentPath].conn_length.min > track.accesslength) {
                                    returnedValue.pages[track.currentPath].conn_length.min = track.accesslength
                            }
                            // conn_length > moy
                            returnedValue.pages[track.currentPath].conn_length.moy += track.accesslength
                            if(returnedValue.pages[track.currentPath].conn_length.max === undefined || 
                                returnedValue.pages[track.currentPath].conn_length.max < track.accesslength) {
                                    returnedValue.pages[track.currentPath].conn_length.max = track.accesslength
                            }
                            // res > time > min 
                            if(returnedValue.pages[track.currentPath].res.min === undefined || 
                                returnedValue.pages[track.currentPath].res.min > track.res.restime) {
                                    returnedValue.pages[track.currentPath].res.min = track.res.restime
                            }
                            // res > time > moy 
                            returnedValue.pages[track.currentPath].res.moy += track.res.restime
                            // res > time > max 
                            if(returnedValue.pages[track.currentPath].res.max === undefined || 
                                returnedValue.pages[track.currentPath].res.max < track.res.restime) {
                                    returnedValue.pages[track.currentPath].res.max = track.res.restime
                            }
                            returnedValue.pages[track.currentPath].res.max
                            if(track.isDangerous){
                                returnedValue.pages[track.currentPath].req.danger.total_count++
                                returnedValue.pages[track.currentPath].req.danger.list.push(track.req.body)
                            }
                        }
                    })
                })
                for (let page in returnedValue.pages) {
                    returnedValue.pages[page].conn_length.moy /= returnedValue.pages[page].req.total_count
                }
                for (let page in returnedValue.pages) {
                    returnedValue.pages[page].res.moy /= returnedValue.pages[page].req.total_count
                }
                returnedValue.summary = {
                    visit_count : visitors,
                    unique_visit_count : uniqueVisitor.length,
                    from : from,
                    to : to,
                    request_count: reqCount
                }
            }
        })
        console.log(returnedValue)
        // // console.log (returnedValue)
        // let findReqCond = { timestamp: { $gte: from, $lt: to } }
        // let reqMapIdTimeStamp = {}
        // let link_id_tab = []
        // let reqCount = 0
        // await RequestSchema.find(findReqCond, async (err, requests) => {
        //     if(err) {
        //         console.log(err)
        //     } else {
        //         // get request timestamps informations :
        //         await requests.forEach(request => {
        //             console.log(request.timestamp)
        //             reqCount++
        //             if(request.isDangerous === true) {
        //                 returnedValue.pages[request.req.action].req.danger.total_count++
        //                 returnedValue.pages[request.req.action].req.danger.list.push(request.req.body)
        //             }
        //             link_id_tab.push(request.link_id)
        //             reqMapIdTimeStamp[request.link_id] = 
        //                 {
        //                     timestamp : request.timestamp, 
        //                     action : request.req.action 
        //                 }
        //         })
        //         returnedValue.summary.request_count = reqCount
        //     }
        // })
        // let findResCond =  { link_id : { $in: link_id_tab } }
        // let requestedPath
        // await ResponseSchema.find(findResCond, async (err, responses) => {
        //     if(err) {
        //         console.log(err)
        //     } else {
        //         await responses.forEach(response => {
        //             if(reqMapIdTimeStamp[response.link_id] !== undefined) {
        //                 requestedPath = reqMapIdTimeStamp[response.link_id].action
        //                 if(returnedValue.pages[requestedPath] === undefined){
        //                     returnedValue.pages[requestedPath] = {}
        //                     returnedValue.pages[requestedPath].res = {}
        //                     returnedValue.pages[requestedPath].res.time = {}
        //                     returnedValue.pages[requestedPath].res.moy = 0
        //                     returnedValue.pages[requestedPath].res.total_count = 0
        //                 }
        //                 returnedValue.pages[requestedPath].res.total_count++
        //                 // res > time > min 
        //                 if(returnedValue.pages[requestedPath].res.min === undefined || 
        //                     returnedValue.pages[requestedPath].res.min > (response.timestamp - reqMapIdTimeStamp[response.link_id].timestamp)) {
        //                         returnedValue.pages[requestedPath].res.min = (response.timestamp - reqMapIdTimeStamp[response.link_id].timestamp)
        //                 }
        //                 // res > time > moy 
        //                 returnedValue.pages[requestedPath].res.moy += (response.timestamp - reqMapIdTimeStamp[response.link_id].timestamp)
        //                 // res > time > max 
        //                 if(returnedValue.pages[requestedPath].res.max === undefined || 
        //                     returnedValue.pages[requestedPath].res.max < (response.timestamp - reqMapIdTimeStamp[response.link_id].timestamp)) {
        //                         returnedValue.pages[requestedPath].res.max = (response.timestamp - reqMapIdTimeStamp[response.link_id].timestamp)
        //                 }
        //                 returnedValue.pages[requestedPath].res.max
        //             }
        //         })
        //         for (let page in returnedValue.pages) {
        //             returnedValue.pages[page].res.moy /= returnedValue.pages[page].res.total_count
        //         }
        //     }
        // })
        // multi co
        await this.getMultiConnectionRange(from, to, 300, results => {
            returnedValue.summary.max_multiconnection = 0
            results.forEach(result => {
                if(returnedValue.summary.max_multiconnection < result.nbr) {
                    returnedValue.summary.max_multiconnection = result.nbr
                }
            })
        })

        if (returnedValue.pages[page_name] === undefined){
            callback(returnedValue)
        } else {
            returnedValue.pages[page_name].path = page_name
            callback(returnedValue.pages[page_name])
        }
    }

    getMostViewedPageOnPlage() {
        return false
    }
    getLessViewedPageOnPlage() {
        return false
    }
}

module.exports = new TrackingApi()