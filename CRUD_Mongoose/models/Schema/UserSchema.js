//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    login : String,
    password : String,
    name : String,
    firstName : String,
    tel : String,
    mail : String,
    detail : Schema.Types.Mixed,
    game : [Schema.Types.Mixed],
    lastConDate : Date,
    createdDay : Date,
    isDelete : Boolean
});

mongoose.model('UserModel', UserSchema)