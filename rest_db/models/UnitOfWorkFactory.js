const config = require("../config.json")
const dotenv = require('dotenv')
const logger = require('link_logger')
dotenv.config()

getDbConfig = (configNum) => {
	return config[process.env.db_env][configNum]
}
module.exports = {
	getConnection: (configNum) => {
		let dbConfig = getDbConfig(configNum)
		try {
			switch (dbConfig.type) {
				case "mock":
					console.log("Yey je suis la ! Mock de reported")
					return {}
				case "postgresql":
					console.log("Not yet implemented")
					return {}
				case "mysql":
					let mysql = require("mysql")
					return mysql.createConnection({
						host: dbConfig.host
						, database: dbConfig.database
						, user: dbConfig.user
						, password: dbConfig.password
					})
				case "mongodb":
					let mongoose = require("mongoose")
					mongoose.set('useCreateIndex', true)
					mongoose.connect('mongodb://' + dbConfig.host + '/' + dbConfig.database, { useNewUrlParser: true })
					return mongoose.connection
			}
		} catch (e) {
			logger.error("Could not create connection. Error : " + e.tostring())
		}
	}
}