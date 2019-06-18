//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const journeySchema = new Schema({
    journey :   [{
        accesslength : Number,
        timestamp : Date,
        currentPath : String,
        requestedPath : String,
        isDangerous : Boolean,
        reqbody :Schema.Types.Mixed,
        res : {
            cookies : Schema.Types.Mixed,
            error : Schema.Types.Mixed,
            locals : Schema.Types.Mixed,
            restime : Number
        }
    }],
    summary : {
        user_id : String,
        from : Date,
        to : Date,
        action : String,
        totaltime : String
    }
}, 
{
    collection : "journey"
})

module.exports = mongoose.model("journeySchema", journeySchema)