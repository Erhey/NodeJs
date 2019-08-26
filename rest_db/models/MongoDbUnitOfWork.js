const logger = require('link_logger')
const { getDbConfig, getConnection, getMongoDbSchema } = require('../models/UnitOfWorkFactory')

module.exports = {
    exec: async (configNum, queryType, collection, queryContent, callback) => {
        try {
            let dbConfig = getDbConfig(configNum)
            if (dbConfig.type !== 'mongodb') {
                logger.error('Passed configuration is not a mongo db connection!')
                callback({
                    status: '403',
                    message: 'Passed configuration is not a mongo db connection!'
                })
            } else {
                try {
                    switch (queryType) {
                        case "find":
                            callback(find(configNum, collection, queryContent))
                            break
                        case "insertMany":
                            callback(insertMany(configNum, collection, queryContent))
                            break

                        case "updateMany":
                            callback(updateMany(configNum, collection, queryContent))
                            break
                        default:
                            logger.info("Please define queryType !")
                            callback({
                                status: "400",
                                message: "Bad request ! Please define a valuable queryType!"
                            })
                            break
                    }
                } catch (err) {
                    logger.error("Unexpected error occured !" + err)
                    callback({
                        status: "500",
                        message: "Unexpected error occured !"
                    })
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
        find: (configNum, collection, queryContent) => {
            let connection = await getConnection(configNum)
            let collectionSchema = getMongoDbSchema(configNum, collection)
            collectionSchema.find(conditions, (err, result) => {
                let result = {}
                if (err) {
                    logger.error("MongoDb error occured! Error : " + err)
                    result.status = 408
                    result.message = "MongoDb error occured!"
                } else {
                    result.status = 201
                    result.result = result
                }
                connection.close()
                return result 
            })
        },
        insertMany: (configNum, collection, queryContent) => {

            let connection = await getConnection(configNum)
            let collectionSchema = getMongoDbSchema(configNum, collection)
            collectionSchema.insertMany(queryContent, (err, result) => {
                if (err) {
                    logger.error("MongoDb error occured! Error : " + err)
                    result.status = 408
                    result.message = "MongoDb error occured!"
                } else {
                    result.status = 201
                    result.result = result
                }
                connection.close()
                return result 
            })
        },
        updateMany: (configNum, collection, queryContent) => {
            if(queryContent.conditions !== undefined && queryContent.$set !== undefined){
                let connection = await getConnection(configNum)
                let collectionSchema = getMongoDbSchema(configNum, collection)
                collectionSchema.updateMany(queryContent.conditions,{ $set : queryContent.$set }, (err, result) => {
                    if (err) {
                        logger.error("MongoDb error occured! Error : " + err)
                        result.status = 408
                        result.message = "MongoDb error occured!"
                    } else {
                        result.status = 201
                        result.result = result
                    }
                    connection.close()
                    return result 
                })
            } else {
                logger.error("Please define 'conditions' and '$set' object in queryContent to update")
                result.status = 400
                result.message = "Bad request for update!"
                return result
            }
        },
        // post: (configNum, sql, args, callback) => {
        //     try {
        //         if (!sql.toUpperCase().includes("INSERT") && !sql.toUpperCase().includes("UPDATE") && !sql.toUpperCase().includes("UPDATE")) {
        //             logger.error('Passed sql should not be executed with post request!')
        //             callback({
        //                 status: '403',
        //                 message: 'Passed sql should not be executed with post request!'
        //             })
        //         } else {
        //             let dbConfig = getDbConfig(configNum)
        //             if (dbConfig.type !== "mysql") {
        //                 logger.error("Passed configuration should be a mysql connection!")
        //                 callback({
        //                     status: "403",
        //                     message: "Passed configuration should be a mysql connection!"
        //                 })
        //             } else {
        //                 try {
        //                     let connection = getConnection(configNum)
        //                     if (args !== null) {
        //                         connection.query(sql, args, (err, result) => {
        //                             if (err) {
        //                                 logger.error(err)
        //                                 callback({
        //                                     status: "404",
        //                                     message: "Mysql error occured!"
        //                                 })
        //                             } else if (result.affectedRows === 0) {
        //                                 callback({
        //                                     status: "404",
        //                                     message: "Could not find(update/delete) or add(insert) the data in database."
        //                                 })
        //                             } else {
        //                                 logger.debug("Data was succesfully posted! ")
        //                                 callback({
        //                                     status: "201",
        //                                     result: result
        //                                 })
        //                             }
        //                         })
        //                     } else {
        //                         connection.query(sql, (err, result) => {
        //                             if (err) {
        //                                 logger.error(err)
        //                                 callback({
        //                                     status: "404",
        //                                     message: "Mysql error occured!"
        //                                 })
        //                             } else if (result.affectedRows === 0) {
        //                                 callback({
        //                                     status: "404",
        //                                     message: "Could not find(update/delete) or add(insert) the data in database."
        //                                 })
        //                             } else {
        //                                 logger.debug("Data was succesfully posted! ")
        //                                 callback({
        //                                     status: "201",
        //                                     result: result
        //                                 })
        //                             }
        //                         })
        //                     }
        //                 } catch (e) {
        //                     logger.error("Mysql error occured! Error : " + e)
        //                     callback({
        //                         status: "404",
        //                         message: "Mysql error occured!"
        //                     })
        //                 }
        //             }

        //         }
        //     } catch (e) {
        //         logger.error("Unexpected error occured! Error : " + e)
        //         callback({
        //             status: "500",
        //             message: "Unexpected error occured!"
        //         })
        //     }
        // },
}