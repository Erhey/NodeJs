//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const journeySchema = new Schema({
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
    collection : "journey"
})

module.exports = mongoose.model("journeySchema", journeySchema)