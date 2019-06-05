const mongoose = require('mongoose')
let mongoConnectionStr = 'mongodb://127.0.0.1/tracking'
const moment = require("moment")
const cookieParser = require("cookie-parser")
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
let g_db = mongoose.connection
let TrackSchema = require("../Schema/trackingSchema")


//Bind connection to error event (to get notification of connection errors)
class MongoDb {
    constructor(){
        if(g_db){
            console.log("Connected to database !".underline.green)
            this.db = g_db
        } else {
            console.log("g_db is undefined".underline.red)
            throw new TypeError("Could not set db attribute as g_db is undefined")
        }
    }

    createTrack(req, res, callback) {
        let jsonTracking = {}
        jsonTracking.timestamp = moment().format()
        if(req.cookies !== undefined){
            if(req.cookies['user'] !== undefined){
                jsonTracking.user_id = req.cookies['user']['user_id']
            }
            if(req.cookies['promotion'] !== undefined){
                jsonTracking.promotion = req.cookies['promotion']['promotion_id']
            }
        }
        if(res.statusCode !== 200) {
            jsonTracking.error = {}
            jsonTracking.error.statusCode = res.statusCode
            jsonTracking.error.message = res.errorMes
        }
        jsonTracking.req = {}
        jsonTracking.req.body = req.body
        jsonTracking.req.action = req.path
        jsonTracking.req.method = req.method
        jsonTracking.res = {}
        jsonTracking.res.body = res.locals
        jsonTracking.res.action = res.path
        this.insertTrack(jsonTracking, result => {
            callback(result)
        })
    }
    insertTrack(jsonTracking, callback) {
        TrackSchema.insertMany(jsonTracking, (err, result) => {
            if (err) {
                console.log(err)
                callback("fail")
            } else {
                console.log(result)
                callback(result)
            }
        })
    }


}
g_db.on('error', console.error.bind(console, 'MongoDB connection error:'))
module.exports = new MongoDb()