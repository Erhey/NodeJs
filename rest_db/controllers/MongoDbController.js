
const mongoDbUOW = require("../models/MongoDbUnitOfWork")
const logger = require("link_logger")


exports.get = (req, res) => {
    if(req.body.configNum !== undefined && req.body.collection !== undefined){
        mongoDbUOW.get(req.body.configNum, req.body.collection, req.body.conditions, result => {
            res.send(result)
        })
    } else if(req.query.configNum !== undefined && req.query.collection !== undefined) {
        mongoDbUOW.get(req.query.configNum, req.query.collection, req.query.conditions, result => {
            res.send(result)
        })
    } else {
        res.send({
            "status" : 500,
            "message" : "Could not get data from request"
        })
    }
}

exports.post = (req, res) => {
    mongoDbUOW.post(req.body.configNum, req.body.sql, req.body.args, result => {
        res.send(result)
    })
}
// exports.put = (req, res) => {
//     mongoDbUOW.put(req.body.configNum, req.body.sql, req.body.args, result => {
//         res.send(result)
//     })
// }
// exports.put = (req, res) => {
//     if (!req.body.from) {
//         res.send("please define from")
//     }
//     else if (!req.body.to) {
//         res.send("please define to")
//     }
//     else if (!req.body.precision) {
//         trackingApi.getMultiConnectionRange(req.body.from, req.body.to, 10, result => {
//             res.send(result)
//         })
//     }
//     else {
//         trackingApi.getMultiConnectionRange(req.body.from, req.body.to, req.body.precision, result => {
//             responseObj = {}
//             responseObj.nbrConnection = result
//             res.send(responseObj)
//         })
//     }
// }
// exports.delete = (req, res) => {
//     console.log("est")
//     trackingApi.getDangerousRequests(req.body.from, result => {
//         res.send(result)
//     })
// }