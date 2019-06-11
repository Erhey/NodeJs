//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const journeySchema = new Schema({
    user_id : String,
    journey :   [{
        accesslength : String,
        timestamp : Date,
        path : String,
        isDangerous : Boolean,
        body : Schema.Types.Mixed 
    }],
    summary : {
        action : String,
        totaltime : String
    }
}, 
{
    collection : "journey"
})

module.exports = mongoose.model("journeySchema", journeySchema)