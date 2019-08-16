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

module.exports = {
	"getConnection": getConnection,
	"getDbConfig" : getDbConfig
}