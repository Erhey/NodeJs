//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var TrackingSchema = new Schema({
    timestamp: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
    },
    error: {
        type : Schema.Types.Mixed
    },
    req: {
        type : Schema.Types.Mixed
    },
    res: {
        type : Schema.Types.Mixed
    },
    country: {
        type: String,
        enum: ["jp", "fr", "us"]
    }
}, 
{
    collection : "tracking"
})

module.exports = mongoose.model("TrackingSchema", TrackingSchema)