const { tracking : link_schema, getMongoConnection } = require('link_schema')
const colors = require('colors')
const logger = require('link_logger')
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
        this.db = db
        this.responseSchema = link_schema.responseSchema
        this.requestSchema = link_schema.requestSchema
        this.journeySchema = link_schema.journeySchema
    }

    /**
     * Which give informations about dangerous requests. (When, Where did that happend and from who)
     * 
     * @param {Date} from From when should we look for dangerous request
     * @param {function} callback 
     */
    async getDangerousRequests(from = undefined, callback) {
        logger.info('getDangerousRequests Start')
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
            let mongoConnection = getMongoConnection(this.db)
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
                    logger.info('getDangerousRequests End')
                    callback(dangerousRequestArr)
                }
            })
            mongoConnection.close()
        } catch (err) {
            logger.error(`Error on getDangerousRequests function : ${error.message}`)
        }
        
    }
    async getUserUUIDList(condObj, callback){
        try {
            let mongoConnection = getMongoConnection(this.db)
            await this.requestSchema.find(condObj, 'user_uuid', async (err, result) =>  {
                if(err) {
                    throw err
                }
                if (result) {
                    callback([...new Set(result.map(request => request.user_uuid))])
                }
            })
            mongoConnection.close()
        } catch (e) {
            logger.error(`Error on getDangerousRequests function : ${error.message}`)
        }
    }
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