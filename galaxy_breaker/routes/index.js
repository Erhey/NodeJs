let express = require('express')
let router = express.Router()
let index_controller = require('../controllers/IndexController')
const validateToken = require('link_jwt')

// routes are defined by Database name
router.post('/addGameResult', validateToken('galaxy_breaker'), index_controller.addGameResult)
router.post('/addPlayer', validateToken('galaxy_breaker'), index_controller.addPlayer)
router.post('/deleteGameResult', validateToken('galaxy_breaker'), index_controller.deleteGameResult)
router.post('/deletePlayer', validateToken('galaxy_breaker'), index_controller.deletePlayer)
router.post('/findPlayerForGameResult', validateToken('galaxy_breaker'), index_controller.findPlayerForGameResult)
router.post('/findGameResultsForPlayer', validateToken('galaxy_breaker'), index_controller.findGameResultsForPlayer)
router.post('/getGameResult', validateToken('galaxy_breaker'), index_controller.getGameResult)
router.post('/getGameResultUUIDForPlayer', validateToken('galaxy_breaker'), index_controller.getGameResultUUIDForPlayer)
router.post('/getPlayer', validateToken('galaxy_breaker'), index_controller.getPlayer)
router.post('/getPlayerUUID', validateToken('galaxy_breaker'), index_controller.getPlayerUUID)

module.exports = router
