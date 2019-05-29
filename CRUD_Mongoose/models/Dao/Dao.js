const mongoose = require('mongoose')
const colors = require("colors")
let mongoConnectionStr = 'mongodb://127.0.0.1/crud_node_test'
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
let g_db = mongoose.connection

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
}
g_db.on('error', console.error.bind(console, 'MongoDB connection error:'))
module.exports = MongoDb