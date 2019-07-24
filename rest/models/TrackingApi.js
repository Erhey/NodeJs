const link_schema = require('link_schema')
const colors = require("colors")
const logger = require("link_logger")(__filename)
/**
 * Tracking API
 * This class gets particular information we want to look at about a site.
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
     * 
     * @param {String} db 
     */
    constructor(db) {
        this.mongoConnection = link_schema.tracking[db].getMongoConnection
        this.responseSchema = link_schema.tracking[db].responseSchema
        this.requestSchema = link_schema.tracking[db].requestSchema
        this.journeySchema = link_schema.tracking[db].journeySchema
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
            await this.requestSchema.find(findCond, (err, result) => {
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
            logger.error("Error on getDangerousRequests function :" + e.toString())
        }
    }
    async getDangerousUsers(callback) {
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
            await this.requestSchema.find(findCond, (err, result) => {
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
            logger.error("Error on getDangerousRequests function :" + e.toString())
        }
    }
    async getUserUUIDList(condObj, callback){
        try {
            await this.requestSchema.find(condObj, 'user_uuid', async (err, result) =>  {
                if(err) {
                    throw err
                }
                if (result) {
                    callback([...new Set(result.map(request => request.user_uuid))])
                }
            })
        } catch (e) {
            logger.error("Error on getDangerousRequests function :" + e.toString())
        }
    }
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
/**
 * Function to be exported. Create a TrackingApi object with parameters.
 * 
 * @param {String} db 
 */
trackingApiBuilder = (db) => {
    return new TrackingApi(db) 
} 

module.exports = trackingApiBuilder