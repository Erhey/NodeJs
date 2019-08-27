const connector = require('link_connection')
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
     * Establish connection to mongoDb database
     * 
     * @param {String} configName 
     */
    constructor(configName) {
        this.configName = configName
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
            connector(this.configName, async ({ connection, requestSchema }) => {
                await requestSchema.find(findCond, (err, result) => {
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
                    connection.close()
                })
            })
        } catch (err) {
            logger.error(`Error on getDangerousRequests function : ${error.message}`)
        }
        
    }
    async getUserUUIDList(condObj, callback){
        try {
            connector(this.configName, async ({ connection, requestSchema }) => {
                await requestSchema.find(condObj, 'user_uuid', async (err, result) =>  {
                    if(err) {
                        throw err
                    }
                    if (result) {
                        callback([...new Set(result.map(request => request.user_uuid))])
                    }
                    connection.close()
                })
            })
        } catch (e) {
            logger.error(`Error on getDangerousRequests function : ${error.message}`)
        }
    }
}
/**
 * Function to be exported. Create a TrackingApi object with parameters.
 * 
 * @param {String} configName 
 */
trackingApiBuilder = (configName) => {
    return new TrackingApi(configName) 
} 

module.exports = trackingApiBuilder