const logger = require('link_logger')
const { getDbConfig, getConnection } = require('../models/UnitOfWorkFactory')

module.exports = {
    exec: async (configNum, sql, args, callback) => {
        let connection = {}
        let result = {}
        if(!checkConfig(configNum, 'mysql')){
            logger.error('Error ! Expected a mysql configuration')
            result.status = 408
            result.message = 'Error ! Expected a mysql configuration'
            callback(result)
        } else {
            try {
                connection = await getConnection(configNum)
                await connection.query(sql, args, (err, result) => {
                    if (err) {
                        logger.error("Mysql error occured!" + err)
                        result.status = 409
                        result.message = "Mysql error occured!"
                    } else {
                        logger.debug(result)
                        result.status = 201
                        result.result = result
                    }
                    callback(result)
                    connection.end()
                })
            } catch (e) {
                logger.error("Unexpected Mysql error occured! Error : " + e)
                result.status = 410
                result.message = "Unexpected Mysql error occured!"
                callback(result)
                connection.end()
            }
        }
    },
    get: async (configNum, sql, args, callback) => {
        try {
            if (!sql.toUpperCase().includes("SELECT")) {
                logger.error('Passed sql should be a select request!')
                callback({
                    status: '403',
                    message: 'Passed sql should be a select request!'
                })
            } else {
                let connection = {}
                let dbConfig = getDbConfig(configNum)
                if (dbConfig.type !== 'mysql') {
                    logger.error('Passed sql should not be executed with get request!')
                    callback({
                        status: '403',
                        message: 'Passed sql should not be executed with get request!'
                    })
                } else {
                    try {
                        connection = await getConnection(configNum)
                        if (args !== null) {
                            await connection.query(sql, args, (err, result) => {
                                if (err) {
                                    logger.error(err)
                                    callback({
                                        status: "404",
                                        message: "Mysql error occured!"
                                    })
                                }
                                else {
                                    logger.debug(result)
                                    callback({
                                        status: "201",
                                        result: result
                                    })
                                }
                            })
                        } else {
                            await connection.query(sql, (err, result) => {
                                if (err) {
                                    logger.error(err)
                                    callback({
                                        status: "404",
                                        message: "Mysql error occured!"
                                    })
                                } else {
                                    logger.debug(result)
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
                    } finally {
                        connection.end()
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
    // put: (configNum, sql, args, callback) => {
    //     try {
    //         if (!sql.toUpperCase().includes("UPDATE")) {
    //             logger.error('Passed sql should be a update request!')
    //             callback({
    //                 status: '403',
    //                 message: 'Passed sql should be a update request!'
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
    //                             } else {
    //                                 logger.debug("Data was succesfully updated! ")
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
    //                             } else {
    //                                 logger.debug("Data was succesfully updated! ")
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
    // delete: (configNum, sql, args, callback) => {
    //     try {
    //         if (!sql.toUpperCase().includes("DELETE")) {
    //             logger.error('Passed sql should be a update request!')
    //             callback({
    //                 status: '403',
    //                 message: 'Passed sql should be a update request!'
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
    //                             } else {
    //                                 logger.debug("Data was succesfully updated! ")
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
    //                             } else {
    //                                 logger.debug("Data was succesfully updated! ")
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
    // }
}