
const RequestSchema = require("../track/Schema/requestSchema")
const mongoose = require('mongoose')
const colors = require("colors")
const logger = require('../logs/winston')(__filename)
// Creating Mongoose connection
const mongoose = require('mongoose')
const mongoConnectionStr = 'mongodb://127.0.0.1/tracking'
let mongoConnection
try {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
    mongoConnection = mongoose.connection
} catch (e) {
    logger.error('Error : '.red + e.red)
}
/**
 * TrackingApi is class to get particular information we want to look at about users.
 * 
 * It defines some functions such as :
 * 
 * getDangerousRequests : Which give informations about dangerous requests. (When, Where did that happend and from who)
 * getPagesVisitedList : List accessed page for a site as a list of string
 * 
 */

class TrackingApi {

    /**
     * Constructor
     * Establish connection to mongodb database
     */
    constructor() {
        if (mongoConnection) {
            logger.info("Connected to database !".green)
            this.db = mongoConnection
        } else {
            logger.error("mongoConnection is undefined".red)
            throw new TypeError("Could not set db attribute as mongoConnection is undefined")
        }
    }

    /**
     * Which give informations about dangerous requests. (When, Where did that happend and from who)
     * 
     * @param {Date} from From when should we look for dangerous request
     * @param {function} callback 
     */
    async getDangerousRequests(from = undefined, callback) {
        logger.info("getDangerousRequests Start")
        let dangerousRequestArr = []
        // Find condition object used when querying Request 
        let findCond
        if (from) {
            findCond = { "timestamp": { $gte: from }, isDangerous: true }
        } else {
            findCond = { isDangerous: true }
        }
        try {
            // Search for Dangerous request
            await RequestSchema.find(findCond, (err, result) => {
                if (err) {
                    throw err
                }
                if (result) {
                    let i = 0
                    for (; i < result.length; i++) {
                        let curRequest = {}
                        curRequest.body = result[i].req.body
                        curRequest.user_info = result[i].cookies
                        curRequest.timestamp = result[i].timestamp
                        dangerousRequestArr.push(curRequest)
                    }
                    logger.info("getDangerousRequests End")
                    callback(dangerousRequestArr)
                }
            })
        } catch (e) {
            logger.info("Error on getDangerousRequests function :".red + e.red)
        }
    }
    /**
     * List accessed page for a site as a list of string
     * 
     * @param {Date} from  From when should we look for dangerous request
     * @param {Date} to 
     * @param {function} callback 
     */
    async getPagesVisitedList(from, to, callback) {
        let pageVisitedList = []
        let findCond = { timestamp: { $gte: from }, timestamp: { $lt: to } }
        await RequestSchema.find(findCond, async (err, requests) => {
            if (err) {
                throw err
            }
            else if (requests) {
                await requests.forEach(request => {
                    if (!pageVisitedList.includes(request.req.action)) {
                        pageVisitedList.push(request.req.action)
                    }
                })
            }
        })
        callback(pageVisitedList)
    }
    // async getUserUUIDList(from, to, callback){

    // }
    // async getUserByName(userName, from, to, callback){
    //     let uuidList = []
    //     let userList = []
    //     await this.getUserUUIDList(from, to, result => {
    //         uuidList = result
    //     })
    //     await this.getUserNameByUUID({ uuid : { $in : uuidList }}, { name : userName } , result => {
    //         return result
    //     })
    // }
    // async getUserbyUUIDAndName(uuidList){

    // }
}

module.exports = new TrackingApi()