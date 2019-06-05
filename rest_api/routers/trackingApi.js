const express = require('express')
const router = express.Router()

const mongoDb = require("../trackingSystem/track")
let user = { 
    "user_id" : "5rR8s9D5fsB515dsGH5sD6X12",
    "name" : "Ritik", 
    "Age" : "18"
}
let promotion = { 
    "promotion_id" : "w8Dg2Xao5w4D45AcpO6K5JU"
}
//Route for adding cookie 
router.post('/', (req, res, next) => { 
    res.cookie("user", user)
    res.cookie("promotion", promotion)
    res.locals.greets = "salut"
    res.statusCode = 200
    mongoDb.createTrack(req, res, result => {
        res.send(result)
    })
}); 





module.exports = router; 