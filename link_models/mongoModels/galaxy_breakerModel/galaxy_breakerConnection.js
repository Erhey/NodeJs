const mongoose = require('mongoose')
const config = require('../../config/keys')
let { playerSchema, purchaseSchema, promotionSchema, itemSchema, levelSchema } = require('./galaxy_breakerSchema')
const galaxyBreakerConfig = config.galaxy_breaker

// Create mongo database connection 
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.galaxyBreakerConnection = mongoose.createConnection('mongodb://' + galaxyBreakerConfig.host + '/' + galaxyBreakerConfig.database, { useNewUrlParser: true })

mongoose.galaxyBreakerConnection.playerSchema = mongoose.galaxyBreakerConnection.model('playerSchema', playerSchema);
mongoose.galaxyBreakerConnection.purchaseSchema = mongoose.galaxyBreakerConnection.model('purchaseSchema', purchaseSchema);
mongoose.galaxyBreakerConnection.promotionSchema = mongoose.galaxyBreakerConnection.model('promotionSchema', promotionSchema);
mongoose.galaxyBreakerConnection.itemSchema = mongoose.galaxyBreakerConnection.model('itemSchema', itemSchema);
mongoose.galaxyBreakerConnection.levelSchema = mongoose.galaxyBreakerConnection.model('levelSchema', levelSchema);
//mongoose.galaxyBreakerConnection.clearHashkey = mongoose.clearHashkey
module.exports = mongoose.galaxyBreakerConnection

