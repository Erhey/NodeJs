const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports.requestSchema = new Schema(
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
module.exports.responseSchema = new Schema(
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