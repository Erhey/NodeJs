const mongoose = require('mongoose')

const Schema = mongoose.Schema
module.exports.authenticationSchema = new Schema(
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
