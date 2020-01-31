


// Get cache layer patched mongoose instance
const mongoose = require('../redisPatch/cached_mongoose')
const config = require('../../config/keys')
let { requestSchema, responseSchema } = require('./trackingSchema')
const trackingConfig = config.tracking

// Create mongo database connection 
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.trackingConnection = mongoose.createConnection('mongodb://' + trackingConfig.host + '/' + trackingConfig.database, { useNewUrlParser: true })

mongoose.trackingConnection.requestSchema = mongoose.trackingConnection.model('requestSchema', requestSchema)
mongoose.trackingConnection.responseSchema = mongoose.trackingConnection.model('responseSchema', responseSchema)

try {

    mongoose.trackingConnection.clearHashkey = mongoose.clearHashkey
} catch (e){
    console.log(e)
}
module.exports = mongoose.trackingConnection
