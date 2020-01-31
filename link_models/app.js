// Getting logger
const logger = require('link_logger')
// Creating Mongoose connection
const config = require('./config/keys')

let isMysql = configName => { return config[configName].type === 'mysql' }
let isMongo = configName => { return config[configName].type === 'mongodb'}
module.exports = {
    isMysql: isMysql
    ,isMongo: isMongo
    ,getMongoConnection: configName => {
        let connectionConfig = config[configName]
        if(!isMongo(configName)){
            logger.error(`Not a mongo connection!
            'Configuration type' : ${connectionConfig.type}`)
            return false
        } else {
            return require(`./mongoModels/${configName}Model/${configName}Connection`)
        }
    }
    ,getMysqlConnection: configName => {
        let connectionConfig = config[configName]
        if(!isMysql(configName)){
            logger.error(`Not a mysql connection!
            'Configuration type' : ${connectionConfig.type}`)
            return false
        }
        else {
            return require(`./mysqlModels/${configName}Model/${configName}Connection`)
        }
    }
}
