
const logger = require('link_logger')
const link_models = require('link_models')
const uuidv4 = require('uuid/v4')
const moment = require('moment')
const CONFIG_NAME = 'galaxy_breaker'
const {
    StatusError_200
    ,StatusError_201
    ,StatusError_400
    ,StatusError_500
    ,StatusError_502
} = require('link_http_code')
/**
 * Execute Sql query and retrieved the data without modifications
 * 
 * Sql query could be executed as a simple request or a prepared request
 */

module.exports.getPlayer = async (pseudoOrUUID, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            SELECT *
            FROM player
            WHERE (pseudo = '${pseudoOrUUID}' OR uuid = '${pseudoOrUUID}')
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player found! rows : ${rows}`)
                result = new StatusError_200()
                result.rows = rows
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.findPlayerForGameResult = async (game_result_uuid, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            SELECT *
            FROM player
            WHERE uuid IN (
                SELECT player_uuid 
                FROM game_result 
                WHERE uuid = '${game_result_uuid}'
                ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
            )
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player found! rows : ${rows}`)
                result = new StatusError_200()
                result.rows = rows
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.getPlayerUUID = async (pseudo, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            SELECT uuid
            FROM player
            WHERE pseudo = '${pseudo}'
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, uuids) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player UUID found! uuids : ${uuids}`)
                result = new StatusError_200()
                result.rows = uuids
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.addPlayer = async (pseudo, name, firstName, tel, mail, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            INSERT INTO player (
                uuid
                ,pseudo
                ,name
                ,firstName
                ,tel
                ,mail
                ,createdDay
                ,isDelete
            ) VALUES (
                '${uuidv4()}'
                ,'${pseudo}'
                ,'${name}'
                ,'${firstName}'
                ,'${tel}'
                ,'${mail}'
                ,'${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}'
                ,'0'
            )
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, result) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player Inserted!`)
                result = new StatusError_200()
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.deletePlayer = async (pseudoOrUUID, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
        UPDATE player
        SET isDelete = '1'
        WHERE (pseudo='${pseudoOrUUID}' OR uuid='${pseudoOrUUID}')
        ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'"}
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, err => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player Deleted!`)
                result = new StatusError_200()
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.getGameResult = async (uuid, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            SELECT *
            FROM game_result
            WHERE uuid = '${uuid}'
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player found! rows : ${rows}`)
                result = new StatusError_200()
                result.rows = rows
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.getGameResultUUIDForPlayer = async (pseudoOrUUID, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            SELECT uuid
            FROM game_result
            WHERE (
                player_uuid = '${pseudoOrUUID}'
                OR player_uuid IN (
                    SELECT uuid 
                    FROM player 
                    WHERE pseudo = '${pseudoOrUUID}' 
                )
            )
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player found! rows : ${rows}`)
                result = new StatusError_200()
                result.rows = rows
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.findGameResultsForPlayer = async (pseudoOrUUID, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
            SELECT *
            FROM game_result
            WHERE player_uuid IN (
                SELECT uuid 
                FROM player
                WHERE (
                    uuid = '${pseudoOrUUID}'
                    OR pseudo = '${pseudoOrUUID}'
                )
                ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
            )
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Player found! rows : ${rows}`)
                result = new StatusError_200()
                result.rows = rows
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.addGameResult = async (pseudoOrUUID, score, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sqlCheck = `
            SELECT uuid
            FROM player
            WHERE (
                uuid = '${pseudoOrUUID}'
                OR pseudo = '${pseudoOrUUID}'
            )
            ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sqlCheck)
        await mysqlConnection.query(sqlCheck, async (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                rows = new StatusError_502('Mysql error occured!')
            }
            logger.debug("Nbr of Rows :" + rows.length)
            if (rows.length === 0) {
                logger.error(`Player ${pseudoOrUUID} is not found`)
                callback(new StatusError_400(`Player was not found. Could not add Game Result!`))
            } else if (rows.length > 1) {
                logger.error(`More than one player was found! ${rows}`)
                callback(new StatusError_400(`More than one player was found! Could not add Game Result!`))
            } else {
                logger.debug(`Player found ! ${rows[0].uuid} `)
                let player_uuid = rows[0].uuid
                let sqlInsert = `
                    INSERT INTO game_result (
                        uuid
                        ,player_uuid
                        ,score
                        ,createdTime
                        ,isDelete
                    ) VALUES (
                        '${uuidv4()}'
                        ,'${player_uuid}'
                        ,'${score}'
                        ,'${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}'
                        ,'0'
                    )
                `
                logger.debug(sqlInsert)
                await mysqlConnection.query(sqlInsert, err => {
                    if (err) {
                        logger.error('Mysql error occured!' + err)
                        result = new StatusError_502('Mysql error occured!')
                    } else {
                        logger.debug(`Game Result Inserted!`)
                        result = new StatusError_201()
                    }
                    callback(result)
                })
            }
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
module.exports.deleteGameResult = async (pseudoOrUUID, isDeleteFlg, callback) => {
    try {
        let result
        const mysqlConnection = link_models.getMysqlConnection(CONFIG_NAME)
        let sql = `
        UPDATE game_result
        SET isDelete = '1'
        WHERE uuid='${pseudoOrUUID}'
        ${isDeleteFlg === 'true' ? "" :"AND isDelete <> '1'" }
        `
        logger.debug(sql)
        await mysqlConnection.query(sql, (err, rows) => {
            if (err) {
                logger.error('Mysql error occured!' + err)
                result = new StatusError_502('Mysql error occured!')
            } else {
                logger.debug(`Game Result Deleted!`)
                result = new StatusError_201()
            }
            callback(result)
        })
    } catch (err) {
        // Internal Unexpected Server error
        logger.error(`Unexpected error occured ! + ${err}`)
        callback(new StatusError_500(err.message))
    }
}
