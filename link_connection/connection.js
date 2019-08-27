// Getting logger
const logger = require('link_logger')
// Creating Mongoose connection
const config = require('./config.json').dev
const mongoose = require('mongoose')

const schemas = require('./schema')

module.exports = isMysql = configName => {
    let connectionConfig = config[configName]
    return connectionConfig.type === 'mysql'
}
module.exports = isMongo = configName => {
    let connectionConfig = config[configName]
    return connectionConfig.type === 'mongo'
}
module.exports = getConnection = async (configName, callback) => {
    let connectionConfig = config[configName]
    try {
        switch (connectionConfig.type) {
            case 'mongodb':
                callback(await getMongoConnection(connectionConfig))
                break
            case 'mysql':
                callback(await getMysqlConnection(connectionConfig))
                break
            case 'postgresql':
                logger.error(`postgresql is not yet supported
            'connectionConfig.type' : ${connectionConfig.type}`)
                callback(false)
                break
            default:
                logger.error(`passed configType is not yet supported
            'connectionConfig.type' : ${connectionConfig.type}`)
                callback(false)
                break
        }
    } catch (err) {
        logger.error(`Unexpected error! 
        'configName' : ${configName}
        'error' :${err}`)
        throw err
    }
}
const createMongoose = connectionConfig => {
    try {
        // 'mongodb://127.0.0.1/tracking'
        mongoose.set('useCreateIndex', true)
        return mongoose.createConnection('mongodb://' + connectionConfig.host + '/' + connectionConfig.database, { useNewUrlParser: true })
    } catch (err) {
        logger.error(`Error while trying to connection to mongoDB! ${err.message}
            connectionConfig: ${connectionConfig}`)
        return false
    }
}
const getMongoConnection = connectionConfig => {
    let mongoConnection = {}
    mongoConnection.connection = createMongoose(connectionConfig)
    if (mongoConnection.connection) {
        Object.keys(schemas[connectionConfig.name]).map( key => { 
                mongoConnection[key] = mongoConnection.connection.model(key, [connectionConfig.name][key])
            }
        )
        return mongoConnection
    } else {
        logger.error(`Error while trying to connection to mongoDB!
        'connectionConfig' : ${connectionConfig.toString()}`)
        return false
    }
}
const getMysqlConnection = connectionConfig => {
    const mysql = require('mysql')
    return mysql.createConnection({
        host: connectionConfig.host
        , database: connectionConfig.database
        , user: connectionConfig.user
        , password: connectionConfig.password
    })
}