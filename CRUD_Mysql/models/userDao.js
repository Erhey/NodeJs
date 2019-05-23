let mysql = require("mysql")
let Dao = require('./Dao')

class UserDao extends Dao {
    constructor() {
        super()
        console.log("je pass")
    }
    find(id) {
        if(id===undefined){
            throw new TypeError ("id should not be null")
        }
        else {
            console.log(id)
        }
    }
    checkLogin(login, password) {
        console.log("test")
        return true
    }

}

module.exports = UserDao
// connection.end(function(err) {
//     if (err) {
//       return console.log('error:' + err.message);
//     }
//     console.log('Close the database connection.');
//   });

