//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    timestamp: {
        type: Date,
        required: true
    },
    cookies: {
        type: Schema.Types.Mixed,
    },
    req: {
        type : Schema.Types.Mixed
    },
    link_id :{
        type : Schema.Types.ObjectId
    },
    journey : Boolean
}, 
{
    collection : "request"
})

module.exports = mongoose.model("requestSchema", requestSchema)