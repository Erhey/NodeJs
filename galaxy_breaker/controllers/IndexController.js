const indexModel = require('../models/IndexModel')
const logger = require('link_logger')
const { StatusError_500 } = require('link_http_code') 

module.exports = {
    /**
     * Generate a specified token linked to the login/password passed parameters
     * 
     * @param login
     * @param password
     */

    getPlayer: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Getting player information...")
        if(req.body.uuid !== undefined) {
            indexModel.getPlayer(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else if(req.body.pseudo !== undefined) {
            indexModel.getPlayer(req.body.pseudo, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`pseudo or uuid should be set to Get a Player!`)
            res.send(new StatusError_500(`pseudo or uuid should be set to Get a Player!`))
        }
    }
    ,findPlayerForGameResult: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Searching Player for current game result...")
        if(req.body.uuid !== undefined) {
            indexModel.findPlayerForGameResult(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`Game Result's uuid should be set to find a Player!`)
            res.send(new StatusError_500(`Game Result's uuid should be set to find a Player!`))
        }
    }
    ,getPlayerUUID: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Getting player uuid information...")
        if(req.body.pseudo !== undefined) {
            indexModel.getPlayerUUID(req.body.pseudo, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`pseudo should be set to get a Player UUID!`)
            res.send(new StatusError_500(`pseudo should be set to get a Player UUID!`))
        }
    }
    ,addPlayer: (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Add new player...")
        logger.debug(req.body)
        if(req.body.pseudo !== undefined) {
            indexModel.addPlayer(req.body.pseudo, req.body.name, req.body.firstName, req.body.tel, req.body.mail, result => {
                res.send(result)
            })
        } else {
            logger.error(`pseudo or uuid should be set to delete a Game Result!`)
            res.send(new StatusError_500(`pseudo or uuid should be set to delete a Game Result!`))
        }
    }
    ,deletePlayer: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Delete player...")
        if(req.body.uuid !== undefined) {
            indexModel.deletePlayer(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else if(req.body.pseudo !== undefined) {
            indexModel.deletePlayer(req.body.pseudo, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`pseudo or uuid should be set to delete a Game Result!`)
            res.send(new StatusError_500(`pseudo or uuid should be set to delete a Game Result!`))
        }
    }
    ,getGameResult: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Getting Game Result information...")
        if(req.body.uuid !== undefined) {
            indexModel.getGameResult(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`uuid should be set to Get a Game Result!`)
            res.send(new StatusError_500(`uuid should be set to Get a Game Result!`))
        }
    }
    ,getGameResultUUIDForPlayer: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Getting Game Result information...")
        if(req.body.uuid !== undefined) {
            indexModel.getGameResultUUIDForPlayer(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else if(req.body.pseudo !== undefined) {
            indexModel.getGameResultUUIDForPlayer(req.body.pseudo, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`uuid should be set to Get a Game Result!`)
            res.send(new StatusError_500(`uuid should be set to Get a Game Result!`))
        }
    }
    ,findGameResultsForPlayer: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Getting Game Results information for user information...")
        if(req.body.uuid !== undefined) {
            indexModel.findGameResultsForPlayer(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else if(req.body.pseudo !== undefined) {
            indexModel.findGameResultsForPlayer(req.body.pseudo, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`pseudo or uuid should be set to Get a Player!`)
            res.send(new StatusError_500(`pseudo or uuid should be set to Get a Player!`))
        }
    }
    ,addGameResult: async (req, res, next) => {
        logger.debug("Adding Game Result...")
        if(req.body.player_uuid !== undefined && req.body.score !== undefined) {
            indexModel.addGameResult(req.body.player_uuid, req.body.score, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else if(req.body.pseudo !== undefined) {
            indexModel.addGameResult(req.body.pseudo, req.body.score, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`Player's 'player_uuid or pseudo' and score should be set to add a Game Result!`)
            res.send(new StatusError_500(`Player's 'player_uuid or pseudo' and score should be set to add a Game Result!`))
        }
    }
    ,deleteGameResult: async (req, res, next) => {
        // Get access_account information using login/password 
        logger.debug("Add new player...")
        if(req.body.uuid !== undefined) {
            indexModel.deleteGameResult(req.body.uuid, req.body.isDeleteFlg, result => {
                res.send(result)
            })
        } else {
            logger.error(`uuid should be set to delete a Game Result!`)
            res.send(new StatusError_500(`uuid should be set to delete a Game Result!`))
        }
    }
}
