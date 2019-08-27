const mongoose = require('mongoose')
const Schema = mongoose.Schema
let requestSchema = new Schema(
    {
        timestamp: {
            type: Date
            , required: true
        },
        user_uuid: {
            type: String
        },
        req: {
            type: Schema.Types.Mixed
        },
        link_id: {
            type: Schema.Types.ObjectId
        }
        , isDangerous: Boolean
    },
    {
        collection: 'request'
    }
)
let responseSchema = new Schema(
    {
        timestamp: {
            type: Date
            , required: true
        },
        restime: {
            type: Number
        },
        action: {
            type: String
        },
        error: {
            type: Schema.Types.Mixed
        },
        locals: {
            type: Schema.Types.Mixed
        },
        link_id: {
            type: Schema.Types.ObjectId
        }
    }
    , {
        collection: 'response'
    }
)
let authenticationSchema = new Schema(
    {
        name: {
            type: String
            , required: true
        },
        login: {
            type: String
            , required: true
            , unique: true
        },
        password: {
            type: String
            , required: true
        },
        audience: {
            type: String
            , required: true
        },
        expiresIn: {
            type: String
            , required: true
        },
        createdAt: {
            type: Date
            , required: true
        },
        updatedAt: {
            type: Date
            , required: true
        }
    },
    {
        collection: 'authentication'
    }
)
module.exports = {
    'tracking': {
        responseSchema : mongoose.model('responseSchema', responseSchema)
        ,requestSchema : mongoose.model('requestSchema', requestSchema)
    },
    'jwt': {
        authenticationSchema : mongoose.model('authenticationSchema', authenticationSchema)
    } 
}