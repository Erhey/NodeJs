//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const journeySchema = new Schema({
    user_id : String,
    journey :   [{
        timestamp : Date,
        path : String,
        body : Schema.Types.Mixed 
    }]
}, 
{
    collection : "journey"
})

module.exports = mongoose.model("journeySchema", journeySchema)