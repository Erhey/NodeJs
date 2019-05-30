// //Require Mongoose
// var mongoose = require('mongoose');

// //Define a schema
// var Schema = mongoose.Schema;

// var TrackingSchema = new Schema({

//     connection_status : {
//         type : String,
//         enum : ["200", "401", "402", "403", "404", "500"],
//         required : true
//     },
//     path : {
//         type : String,
//         required : true
//     },
//     connection_time : {
//         type : Long,
//         required : true
//     }	Long
//     response_time : {
//         type : ,
//         required : true,

//     }	Long
//     user_id : {
//         type : ,
//         required : true,

//     }	String
//     error_message : {
//         type : ,
//         required : true,

//     }	String
//     promotion_id : {
//         type : ,
//         required : true,

//     }	Boolean
//     from : {
//         type : ,
//         required : true,

//     }	String
//     to : {
//         type : ,
//         required : true,

//     }	String
//     req : {
//         type : ,
//         required : true,

//     }	Mixed
//     crud : {
//         type : ,
//         required : true,

//     }	enum : {'get','post','put','delete'}
    


//     login: {
//         type: String,
//         unique: true,
//         minlength: 3,
//         maxlength: 30,
//         required: [true, 'Login is required !']
//     },
//     password: {
//         type: String,
//         minlength: 3,
//         maxlength: 30,
//         required: [true, 'Password is required !']
//     },
//     name: {
//         unique: true,
//         type: String,
//         validate: {
//             validator: function (v, cb) {
//                 let regex = /^[\w\s\S]*$/
//                 cb(v == null || v.trim().length < 1) || regex.test(v), v + " is an invalid name."
//             },
//             message: 'Default error message.'
//         },
//         maxlength: 30,
//         required: [true, 'Name is required !']
//     },
//     firstName: {
//         unique: true,
//         type: String,
//         validate: {
//             validator: function (v, cb) {
//                 let regex = /^[\w\s\S]*$/
//                 cb(v == null || v.trim().length < 1) || regex.test(v), v + " is an invalid firstname."
//             },
//             message: 'Default error message.'
//         },
//         maxlength: 30,
//         required: [true, 'FirstName is required !']
//     },
//     tel: {
//         type: String,
//         validate: {
//             validator: function (v, cb) {
//                 let regex = /^\d{8-13}*$/
//                 cb(v == null || v.trim().length < 1) || regex.test(v), v + " is an invalid firstname."
//             },
//             message: 'Default error message.'
//         },
//         maxlength: 30,
//         required: [true, 'Telephone is required !']
//     },
//     mail: {
//         type: String,
//         trim: true,
//         lowercase: true,
//         unique: true,
//         required: 'Email address is required !',
//         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//     },
//     lastConDate: {
//         type: Date,
//         default: Date.now
//     },
//     createdDay: {
//         type: Date,
//         default: Date.now
//     },
//     isDelete: {
//         type: Boolean,
//         default: true
//     }
// },
//     {
//         collection: "user"
//     }
// );

// module.exports = mongoose.model("UserBean", UserSchema)