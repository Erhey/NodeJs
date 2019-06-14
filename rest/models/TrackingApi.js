
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
    async getPagesInfo(from, to, callback) {
        let unique_user = []
        let returnedValue = {}
        returnedValue.pages = {}
        
        let findJourneyCond = { timestamp: { $gte: from, $lt: to } }
        await JourneySchema.find(findJourneyCond, async (err, results) => {
            if(err) {
                console.log(err)
            } else {
                console.log(results.length)
                await results.forEach(result => {
                    for(track in result.journey) {
                        if(moment(track.timestamp) > moment(from) && moment(track.timestamp) < moment(to)){
                            if(returnedValue.pages[track.currentPath] === undefined){
                                returnedValue.pages[track.currentPath] = {}
                                returnedValue.pages[track.currentPath].conn_length = {}
                                returnedValue.pages[track.currentPath].res = {}
                                returnedValue.pages[track.currentPath].req = {}
                                returnedValue.pages[track.currentPath].req.all_count = 0
                            }
                            if(track.isDangerous === true) {
                                returnedValue.pages[track.currentPath].req.danger.count++
                                returnedValue.pages[track.currentPath].req.danger.list.push(track.body)
                            }
                            returnedValue.pages[track.currentPath].req.req_count++
                            // conn_length > min
                            if(returnedValue.pages[track.currentPath].conn_length.min === undefined || 
                                returnedValue.pages[track.currentPath].conn_length.min > track.accesslength) {
                                    returnedValue.pages[track.currentPath].conn_length.min = track.accesslength
                            }
                            
                            // conn_length > moy
                            returnedValue.pages[track.currentPath].conn_length.moy += track.accesslength
                            
                            // conn_length > max
                            if(returnedValue.pages[track.currentPath].conn_length.max === undefined || 
                                returnedValue.pages[track.currentPath].conn_length.max > track.accesslength) {
                                    returnedValue.pages[track.currentPath].conn_length.max = track.accesslength
                            }
                        }
                    }
                    if(!unique_user.includes(results.cookies["user_id"])) {
                        unique_user.push(results.cookies["user_id"])
                    }
                    returnedValue.pages[track.currentPath].conn_length.moy /= info.req.visite
                })
                for (let page in returnedValue.pages) {
                    returnedValue.pages[page].conn_length.moy /= returnedValue.pages[page].req.visite
                }
            }
        })
        console.log (returnedValue)
        let userInfo = {}
        let findReqCond = { timestamp: { $gte: from, $lt: to } }
        let reqMapIdTimeStamp = {}
        let link_id_tab = []
        let uniqueUser = []
        await RequestSchema.find(findReqCond, async (err, requests) => {
            if(err) {
                console.log(err)
            } else {
                
                // get request timestamps informations :
                await requests.forEach(request => {
                    link_id_tab.push(request.link_id)
                    reqMapIdTimeStamp[request.link_id] = 
                        {
                            timestamp : request.timestamp, 
                            action : request.req.action 
                        }
                })
                // get visite number
                userInfo.visite = requests.length
                // get unique visite number
                userInfo.unique_visite = uniqueUser.length
            }
        })
        console.log(userInfo)
        console.log(link_id_tab)
        let findResCond =  { link_id : { $in: link_id_tab } }
        let requestedPath
        await ResponseSchema.find(findResCond, async (err, responses) => {
            if(err) {
                console.log(err)
            } else {
                await responses.forEach(response => {
                    if(reqMapIdTimeStamp[response.link_id] !== undefined) {
                        requestedPath = reqMapIdTimeStamp[response.link_id].action
                        if(returnedValue.pages[requestedPath] === undefined){
                            returnedValue.pages[requestedPath] = {}
                            returnedValue.pages[requestedPath].res = {}
                            returnedValue.pages[requestedPath].res.time = {}
                        }
                        // res > time > min 
                        if(returnedValue.pages[requestedPath].res.time.min === undefined || 
                            returnedValue.pages[requestedPath].res.time.min > reqMapIdTimeStamp[response.link_id].timestamp) {
                                returnedValue.pages[requestedPath].res.time.min = reqMapIdTimeStamp[response.link_id].timestamp
                        }
                        
                        // res > time > moy 
                        returnedValue.pages[requestedPath].res.time.moy += reqMapIdTimeStamp[response.link_id].timestamp
                        
                        // res > time > max 
                        if(returnedValue.pages[requestedPath].res.time.max === undefined || 
                            returnedValue.pages[requestedPath].res.time.max < reqMapIdTimeStamp[response.link_id].timestamp) {
                                returnedValue.pages[requestedPath].res.time.max = reqMapIdTimeStamp[response.link_id].timestamp
                        }
                        returnedValue.pages[requestedPath].res.time.max
                    }
                })
                // for (let page in returnedValue.pages) {
                //     returnedValue.pages[page].res.time.moy /= returnedValue.pages[page].req.visite
                // }
            }
        })
    }

    getMostViewedPageOnPlage() {
        return false
    }
    getLessViewedPageOnPlage() {
        return false
    }
}

module.exports = new TrackingApi()