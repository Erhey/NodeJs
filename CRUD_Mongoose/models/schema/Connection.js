//Require Mongoose
let mongoose = require('mongoose');

//Define a schema
let Schema = mongoose.Schema;

let ConnectionSchema = new Schema(
    {
        login: {
            type: String,
            unique: true,
            minlength: 8,
            maxlength: 30,
            required: [true, 'Please insert a login']
        },
        password: {
            type: String,
            maxlength: 30,
            minlength: 8,
            required: [true, 'Please insert a password']
        }
    },
    {
        collection: 'user'
    }
);


module.exports = mongoose.model("connection", ConnectionSchema)
