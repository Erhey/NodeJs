const express = require('express')
const router = express.Router()

//Route for adding cookie 
router.get('/', (req, res, next) => { 
    res.render("index")
}); 
module.exports = router