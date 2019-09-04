

let express = require('express')
let router = express.Router()

let index_controller = require('../controllers/indexController')
const validateToken = require('link_jwt')
router.use(validateToken('live_info'))


router.post('/multiconnectionsAt', index_controller.multiconnectionsAt) 
router.post('/multiconnectionsRange', index_controller.multiconnectionsRange) 
router.post('/dangerousRequest', index_controller.dangerousRequest) 
router.get('/visitedPages', index_controller.visitedPages)
router.post('/pagesInfo', index_controller.pagesInfo)
router.get('/getGraph', index_controller.getGraph)
router.get('/getGraphFormat', index_controller.getGraphFormat)
router.get('/getLiveInfo', index_controller.getLiveInfo)
router.get('/updateExcel', index_controller.updateExcel)
router.post('/getUserUUIDList', index_controller.getUserUUIDList)

module.exports = router
