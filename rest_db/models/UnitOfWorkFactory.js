const config = require("../config.json")
const dotenv = require('dotenv')
const logger = require('link_logger')
const { getMongoConnection, getMysqlConnection } = require('link_schema')
dotenv.config()
let getDbConfig = (configNum) => {
	return config[process.env.db_env][configNum]
}
let getConnection = (configNum) => {
	let dbConfig = getDbConfig(configNum)
	try {
		switch (dbConfig.type) {
			case "mock":
				logger.info("MOCK!  Yey je suis la ! Mock de reported")
				return {}
			case "postgresql":
				logger.info("POSTGRESQL!  Not yet implemented")
				return {}
			case "mysql":
				logger.info("MYSQL")
				return getMysqlConnection(dbConfig.database, dbConfig.host, dbConfig.user, dbConfig.password)
			case "mongodb":
				logger.info("MONGODB")
				return getMongoConnection(dbConfig.database, dbConfig.host)
			default:
				logger.error("ERROR")
		}
	} catch (e) {
		logger.error("Could not create connection. Error : " + e.toString())
	}
}
let checkConfig = (configNum, type) => {
	return getDbConfig(configNum).type === type
}
let getMongoDbSchema = (configNum, collection) => {
	let dbConfig = getDbConfig(configNum)
	if(dbConfig.type !== "mongodb") {
		logger.error("getMongoDbSchema could not be used for something else than mongodb !")
		return false
	} else {
		const link_schema = require('link_schema')
		return link_schema[dbConfig.name][`${collection}Schema`]
	}
}
module.exports = {
	"getConnection": getConnection
	,"getDbConfig" : getDbConfig
	,"checkConfig" : checkConfig
	,"getMongoDbSchema" : getMongoDbSchema
}