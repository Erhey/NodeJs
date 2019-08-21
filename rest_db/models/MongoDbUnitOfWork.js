const logger = require('link_logger')
const { getDbConfig, getConnection, getMongoDbSchema } = require('../models/UnitOfWorkFactory')

module.exports = {
    get: async (configNum, collection, conditions, callback) => {
        try {
            let connection = {}
            let collectionSchema = {}
            let dbConfig = getDbConfig(configNum)
            if (dbConfig.type !== 'mongodb') {
                logger.error('Passed configuration is not a mongo db connection!')
                callback({
                    status: '403',
                    message: 'Passed configuration is not a mongo db connection!'
                })
            } else {
                try {
                    connection = await getConnection(configNum)
                    collectionSchema = getMongoDbSchema(configNum, collection)
                    collectionSchema.find(conditions, (err, result) => {
                        if(err) {
                            logger.error("MongoDb error occured! Error : " + err)
                            callback({
                                status: "404",
                                message: "MongoDb error occured!"
                            })
                        } else {
                            callback(result)
                        }
                        connection.close()
                    })
                } catch (err) {
                    logger.error("Unexpected error occured !" + err)
                    callback({
                        status: "500",
                        message: "Unexpected error occured !"
                    })
                    connection.close()
                }
            }
        } catch (e) {
            logger.error("Unexpected error occured! Error : " + e)
            callback({
                status: "500",
                message: "Unexpected error occured!"
            })
        }
    },
    post: (configNum, sql, args, callback) => {
        try {
            if (!sql.toUpperCase().includes("INSERT") && !sql.toUpperCase().includes("UPDATE") && !sql.toUpperCase().includes("UPDATE")) {
                logger.error('Passed sql should not be executed with post request!')
                callback({
                    status: '403',
                    message: 'Passed sql should not be executed with post request!'
                })
            } else {
                let dbConfig = getDbConfig(configNum)
                if (dbConfig.type !== "mysql") {
                    logger.error("Passed configuration should be a mysql connection!")
                    callback({
                        status: "403",
                        message: "Passed configuration should be a mysql connection!"
                    })
                } else {
                    try {
                        let connection = getConnection(configNum)
                        if (args !== null) {
                            connection.query(sql, args, (err, result) => {
                                if (err) {
                                    logger.error(err)
                                    callback({
                                        status: "404",
                                        message: "Mysql error occured!"
                                    })
                                } else if (result.affectedRows === 0) {
                                    callback({
                                        status: "404",
                                        message: "Could not find(update/delete) or add(insert) the data in database."
                                    })
                                } else {
                                    logger.debug("Data was succesfully posted! ")
                                    callback({
                                        status: "201",
                                        result: result
                                    })
                                }
                            })
                        } else {
                            connection.query(sql, (err, result) => {
                                if (err) {
                                    logger.error(err)
                                    callback({
                                        status: "404",
                                        message: "Mysql error occured!"
                                    })
                                } else if (result.affectedRows === 0) {
                                    callback({
                                        status: "404",
                                        message: "Could not find(update/delete) or add(insert) the data in database."
                                    })
                                } else {
                                    logger.debug("Data was succesfully posted! ")
                                    callback({
                                        status: "201",
                                        result: result
                                    })
                                }
                            })
                        }
                    } catch (e) {
                        logger.error("Mysql error occured! Error : " + e)
                        callback({
                            status: "404",
                            message: "Mysql error occured!"
                        })
                    }
                }

            }
        } catch (e) {
            logger.error("Unexpected error occured! Error : " + e)
            callback({
                status: "500",
                message: "Unexpected error occured!"
            })
        }
    },
}