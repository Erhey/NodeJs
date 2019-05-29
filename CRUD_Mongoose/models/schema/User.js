//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    login : {
        type : String,
        unique: true,
        minlength : 8,
        maxlength : 30,
        required : [true, 'Login is required !']
    },
    password : {
        type : String,
        maxlength : 30,
        minlength : 8,
        required : [true, 'Password is required !']
    },
    name : {
        unique: true,
        type : String,
        validate : {
            validator: function(v, cb) {
                let regex = /^[\w\s\S]*$/
                cb(v == null || v.trim().length < 1) || regex.test(v), v + " is an invalid name."
            },
            message: 'Default error message.'
        },
        maxlength : 30,
        required : [true, 'Name is required !']
    },
    firstName : {
        unique: true,
        type : String,
        validate : {
            validator: function(v, cb) {
                let regex = /^[\w\s\S]*$/
                cb(v == null || v.trim().length < 1) || regex.test(v), v + " is an invalid firstname."
            },
            message: 'Default error message.'
        },
        maxlength : 30,
        required : [true, 'FirstName is required !']
    },
    tel : {
        type : String,
        validate : {
            validator: function(v, cb) {
                let regex = /^\d{9-13}*$/
                cb(v == null || v.trim().length < 1) || regex.test(v), v + " is an invalid firstname."
            },
            message: 'Default error message.'
        },
        maxlength : 30,
        required : [true, 'Telephone is required !']
    },
    mail : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required !',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    lastConDate : {
        type : Date,
        default : Date.now
    },
    createdDay : {
        type : Date,
        default : Date.now
    },
    isDelete : {
        type : Boolean,
        default : true
    }
});


module.exports = mongoose.model("UserBean", UserSchema)