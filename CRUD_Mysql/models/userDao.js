let Dao = require('./Dao')
let moment = require("moment")
let UserBean = require("../models/userBean");
class UserDao extends Dao {
    constructor() {
        super()
    }
    find(id) {
        if (id === undefined) {
            throw new TypeError("id should not be null")
        }
        else {
            console.log(id)
        }
    }
    // checkLogin(login, password) {
    //     console.log("test")
    //     return true
    // }
    checkLogin(login, password, callback) {
        this.db.query("Select count(*) as exist from user where login = ? AND password = ?", [login, password], (err, result) => {
            if (err) console.log(err)
            return callback(result[0].exist)
        })
    }
    insert(userBean, callback) {

        if(userBean.constructor === UserBean){
            moment().locale("jp")
            let lastConDate = moment().format("YY-MM-DD")
            let createdDay = moment().format("YY-MM-DD")
            this.db.query("insert into user (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            [
                                userBean.login, 
                                userBean.password, 
                                userBean.name,  
                                userBean.firstName,  
                                userBean.tel,    
                                userBean.mail, 
                                lastConDate,    
                                createdDay
                            ],
                            (err, result) => {
                if(err) {
                    callback(false, err)
                } else {
                    console.log(result)
                    callback(true)
                }
            })
        } else {
            throw new TypeError("Dao's find method cannot be called directly. Implement it in child classes.")
        }
    }

}

module.exports = UserDao
// connection.end(function(err) {
//     if (err) {
//       return console.log('error:' + err.message);
//     }
//     console.log('Close the database connection.');
//   });

// let Dao = require("./Dao")

// class UsersDao extends Dao {
//   constructor(){
//     super()
//   }
//   getAll() {
//     this.connection.query("select * from Users", [], (err, result) => {
//       console.log(result)
//     });
//   }
//   find(id) {
//     this.connection.query("select * from Users where id = ?", id, (err, result) =>{
//       if (err) console.log(err)
//       console.log(result)
//     })
//   }
//   getByName(name) {
//     this.connection.query("select * from Users where name like ?", '%' + name + '%', (err, result) =>{
//       if (err) console.log(err)
//       console.log(result)
//     })
//   }
//   delete(id) {
//     this.connection.query("delete from Users where id = ?", id, (err, result) =>{
//       if (err) console.log(err)
//       console.log(result)
//     })
//   }
//   checkConnection(login, password){
//     this.connection.query("select count(*) Users where login = ? AND password = ?", [id, password], (err, result) =>{
//       if (err) console.log(err)
//       console.log(result)
//     })
//   }
//   update(Users) {
//     this.connection.query("UPDATE USERS SET login = ?, " + 
//                                             "password = ?, " + 
//                                             "Name = ?, " + 
//                                             "FirstName = ?, " + 
//                                             "tel = ?, " + 
//                                             "mail = ?, " + 
//                                             "lastConDate = ?, " + 
//                                             "createdDay = ?, " + 
//                                             "isDelete = ? " + 
//                                         "where id = ?", 
//                                         [Users.login, 
//                                          Users.password, 
//                                          Users.Name, 
//                                          Users.FirstName, 
//                                          Users.tel, 
//                                          Users.mail, 
//                                          Users.lastConDate, 
//                                          Users.createdDay, 
//                                          Users.isDelete,
//                                          Users.id], (err, result) =>{
//       if (err) console.log(err)
//       console.log(result)
//     })
//   }

//   insert(Users) {
//     this.connection.query("INSERT INTO Users (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) " +
//                                       "VALUES (?,?,?,?,?,?,?,?)", [Users.login, 
//                                                                    Users.password, 
//                                                                    Users.Name, 
//                                                                    Users.FirstName, 
//                                                                    Users.tel, 
//                                                                    Users.mail, 
//                                                                    Users.lastConDate, 
//                                                                    Users.createdDay], (err, result) =>{
//     if (err) console.log(err)
//     console.log(result)
//     })
//   }
//   flag(){
//     console.log("UsersDao class ～call")
//   }
// }
// module.exports = UsersDao; 
