const mongoose = require('../redisPatch/cached_mongoose')
const config = require('../../config/keys')
let { authenticationSchema } = require('./jwtSchema')
const jwtConfig = config.jwt

// Create mongo database connection 
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.jwtConnection = mongoose.createConnection('mongodb://' + jwtConfig.host + '/' + jwtConfig.database, { useNewUrlParser: true })

mongoose.jwtConnection.authenticationSchema = mongoose.jwtConnection.model('authenticationSchema', authenticationSchema)

mongoose.jwtConnection.clearHashkey = mongoose.clearHashkey
module.exports = mongoose.jwtConnection

