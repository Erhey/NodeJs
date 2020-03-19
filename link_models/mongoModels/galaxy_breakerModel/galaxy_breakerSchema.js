const mongoose = require('mongoose')

const Schema = mongoose.Schema
module.exports.playerSchema = new Schema(
    {
        uuid :{
            type: String    
            // ,require: true
        }
        ,login :{
            type: String    
            // ,require: true
        }
        ,password :{
            type: String
            // ,require: true
        }
        ,pseudo :{
            type: String
            // ,require: true
        }
        ,pays :{
            type: String
            // ,require: true
        }
        ,rank :{
            type: String
            // ,require: true
        }
        ,mail :{
            type: String
            // ,require: true
        }
        ,items :{
            type: Schema.Types.Mixed
            // ,require: true
        }
        ,level_results :{
            type: Schema.Types.Mixed
            // ,require: true
        }
        ,exploits :{
            type: Schema.Types.Mixed
            // ,require: true
        }
        ,purchase_history :{
            type: Schema.Types.Mixed
            // ,require: true
        }
    },
    {
        collection: 'player'
    }
)
module.exports.purchaseSchema = new Schema(
    {
        purchase_id: {
            type: String
            // ,require: true
        }
        ,items: {
            type: Schema.Types.Mixed
            // ,require: true
        }
        ,name: {
            type: String
            // ,require: true
        }
        ,price: {
            type: String
            // ,require: true
        }
        ,description: {
            type: String
            // ,require: true
        }
    },
    {
        collection: 'purchase'
    }
)
module.exports.promotionSchema = new Schema(
    {
        promotion_id: {
            type: String
            // ,require: true
        }
        ,items: {
            type: String
            // ,require: true
        }
        ,name: {
            type: String
            // ,require: true
        }
        ,reduction: {
            type: String
            // ,require: true
        }
        ,price: {
            type: String
            // ,require: true
        }
        ,description: {
            type: String
            // ,require: true
        }
        ,from: {
            type: Date
            // ,require: true
        }
        ,to: {
            type: Date
            // ,require: true
        }
    },
    {
        collection: 'promotion'
    }
)
// collection promotion master
module.exports.itemSchema = new Schema(
    {
        item_id: {
            type: String
            // ,require: true
        }
        ,name: {
            type: String
            // ,require: true
        }
        ,description: {
            type: String
            // ,require: true
        }
        ,point: {
            type: String
            // ,require: true
        }
        ,type: {
            type: String
            // ,require: true
        }
        ,rarity: {
            type: String
            // ,require: true
        }
        ,path: {
            type: String
            // ,require: true
        }
    },
    {
        collection: 'item'
    }
)



module.exports.levelSchema = new Schema(
    {

        level_id:{
            type: String
            // ,require: true
        }
        ,nom:{
            type: String
            // ,require: true
        }
        ,planete:{
            type: String
            // ,require: true
        }
        ,bronze_score:{
            type: Number
            // ,require: true
        }
        ,silver_score:{
            type: Number
            // ,require: true
        }
        ,gold_score:{
            type: Number
            // ,require: true
        }
        ,god_score:{
            type: Number
            // ,require: true
        }

    },
    {
        collection: 'level'
    }
)