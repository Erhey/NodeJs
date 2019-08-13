// Getting logger
const logger = require('link_logger')
// Creating Mongoose connection
const mongoose = require('mongoose')

let getMongoConnection = function (mongoConnectionStr) {
    try {
        // 'mongodb://127.0.0.1/tracking'
        mongoose.set('useCreateIndex', true)
        mongoose.connect(mongoConnectionStr, { useNewUrlParser: true })
        return mongoose.connection
    } catch (e) {
        logger.error('Error : '.red + e.red)
    }
}

//Define a schema
const Schema = mongoose.Schema;

/**
 * Site : CRUD-MYSQL
 * Table : tracking
 * Collection : journey
 */
let journeySchema = new Schema({
    total_req : Number,
    isDanger_req : Number,
    isError_req : Number,
    user_id : String,
    from : Date,
    to : Date,
    action : String,
    totaltime : String
}, 
{
    collection : 'journey'
})

/**
 * Site : CRUD-MYSQL
 * Table : tracking
 * Collection : request
 */
let requestSchema = new Schema({
    timestamp: {
        type: Date,
        required: true
    },
    user_uuid: {
        type: String,
    },
    req: {
        type : Schema.Types.Mixed
    },
    link_id :{
        type : Schema.Types.ObjectId
    },
    isDangerous : Boolean,
    journey : Boolean
}, 
{
    collection : 'request'
})
/**
 * Site : CRUD-MYSQL
 * Table : tracking
 * Collection : response
 */
let responseSchema = new Schema({
    timestamp: {
        type: Date,
        required: true
    },
    restime: {
        type: Number
    },
    action: {
        type: String
    },
    error: {
        type : Schema.Types.Mixed
    },
    locals: {
        type : Schema.Types.Mixed
    },
    link_id :{
        type : Schema.Types.ObjectId
    }
}, 
{
    collection : 'response'
})
/**
 * Site : N/A
 * DB : authentication
 * Collection : authentication
 */
let authenticationSchema = new Schema({
    name: {
        type: String
        ,required: true
    },
    login: {
        type: String
        ,required: true
        ,unique : true
    },
    password: {
        type: String
        ,required: true
    },
    createdAt: {
        type: Date
        ,required: true
    },
    updatedAt: {
        type: Date
        ,required: true
    }
}, 
{
    collection : 'authentication'
})



// tracking = {}
// tracking.connections = []
// config.tracking.forEach( connection => {
//     tracking.connections.push ({
//         'name' : connection.name,
//         'getMongoConnection' : getMongoConnection(connection.link),
//         'responseSchema' : mongoose.model('responseSchema', responseSchema),
//         'requestSchema' : mongoose.model('requestSchema', requestSchema),
//         'journeySchema' : mongoose.model('journeySchema', journeySchema)
//     })
// })
// module.exports.tracking = tracking
module.exports.tracking = {
    'CRUD-MYSQL' : {
        // 'getMongoConnection' : getMongoConnection('mongodb://127.0.0.1/CRUD-MYSQL'),
        'responseSchema' : mongoose.model('responseSchema', responseSchema),
        'requestSchema' : mongoose.model('requestSchema', requestSchema),
        'journeySchema' : mongoose.model('journeySchema', journeySchema)
    }
}
module.exports = {
    'authentication' : {
        'getMongoConnection' : getMongoConnection('mongodb://127.0.0.1/authentication'),
        'authenticationSchema' : mongoose.model('authenticationSchema', authenticationSchema)
    }
}