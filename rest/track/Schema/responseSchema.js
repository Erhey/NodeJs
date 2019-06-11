//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    timestamp: {
        type: Date,
        required: true
    },
    cookies: {
        type: Schema.Types.Mixed,
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
    collection : "response"
})

module.exports = mongoose.model("responseSchema", responseSchema)