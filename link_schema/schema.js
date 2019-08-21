// Getting logger
const logger = require('link_logger')
// Creating Mongoose connection
const mongoose = require('mongoose')
const mysql = require('mysql')

const getMongoConnection = (mongoConnectionStr, host='127.0.0.1') => {
    try {
        // 'mongodb://127.0.0.1/tracking'
        mongoose.set('useCreateIndex', true)
        mongoose.connect('mongodb://' + host + '/' + mongoConnectionStr, { useNewUrlParser: true })
        return mongoose.connection
    } catch (err) {
        logger.error(`Error while trying to connection to mongoDB! ${err.message}`)
        return false
    }
}
const getMysqlConnection = (database, host='localhost', user='root', password='') => {
    try {
        return mysql.createConnection({
            host: host
            ,database: database
            ,user: user
            ,password: password
        })
    } catch (err) {
        logger.error(`Error while trying to connection to Mysql! ${err.message}`)
        return false
    }
}
//Define a schema
const Schema = mongoose.Schema

/**
 * Site : CRUD-MYSQL
 * Table : tracking
 * Collection : request
 */
let requestSchema = new Schema(
    {
        timestamp: {
            type: Date
            ,required: true
        },
        user_uuid: {
            type: String
        },
        req: {
            type : Schema.Types.Mixed
        },
        link_id :{
            type : Schema.Types.ObjectId
        }
        ,isDangerous : Boolean
    }
    ,{
        collection : 'request'
    }
)
/**
 * Site : CRUD-MYSQL
 * Table : tracking
 * Collection : response
 */
let responseSchema = new Schema(
    {
        timestamp: {
            type: Date
            ,required: true
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
    }
)
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
    audience: {
        type: String
        ,required: true
    },
    expiresIn: {
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
module.exports = {
    getMongoConnection: getMongoConnection
    ,getMysqlConnection: getMysqlConnection
    ,tracking: {
        responseSchema : mongoose.model('responseSchema', responseSchema)
        ,requestSchema : mongoose.model('requestSchema', requestSchema)
    },
    jwt: {
        authenticationSchema : mongoose.model('authenticationSchema', authenticationSchema)
    }
}