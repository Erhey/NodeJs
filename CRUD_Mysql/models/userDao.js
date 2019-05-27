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
    checkLogin(login, password, callback) {
        this.executePrepared("Select count(*) as exist from user where login = ? AND password = ?", [login, password], (result) => {
            if (!result){
                callback(result)
            } else {
                callback(result[0].exist)
            }
        })
    }
    executePrepared(sql, values, callback) {
        this.db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err)
                return callback(false) 
            }else {
                if(result.lengh <= 0){
                    console.log("No result found")
                    return callback(false) 
                }
                return callback(result)
            }
        })
    }
    searchUser(request, callback) {
        let sql = "Select * from user Where "
        let arrCond = []
        if(request.search_name === "" && request.search_mail === "" && request.search_login === ""){
          console.log("Search conditions not found")
          res.render('searchUser', {"err" : "Search conditions not found"})
        }
        
        if(request.search_name !== "") {
          sql += `name = '${request.search_name}' AND `
          arrCond.push(request.search_name)
        }
        if(request.search_mail !== "") {
          sql += `mail = '${request.search_mail}' AND `
          arrCond.push(request.search_mail)
        }
        if(request.search_login !== "") {
          sql += `login = '${request.search_login}' AND `
          arrCond.push(request.search_login)
        }
        sql = sql.substring(0, sql.length - 5)
        console.log(sql)
        this.executePrepared(sql, arrCond, (result) =>{
            callback(result)
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
    update(user, callback){
        
        moment().locale("jp")
        user.lastConDate = moment(user.lastConDate).format("YYYY-MM-DD")
        user.createdDay = moment(user.lastConDate).format("YYYY-MM-DD")
        let sql = "update user set login = ?, name = ?, firstName = ?, tel = ?, mail = ?, lastConDate = ?, createdDay = ? where id = ?"
        this.executePrepared(sql, [ user.login, user.name, user.firstName, user.tel, user.mail, user.lastConDate, user.createdDay, user.id ], (result) => {
            if (!result){
                callback(false)
            } else {
                callback(true)
            }
        })
    }
    delete(id, callback) {
        let sql = "delete from user where id = ?"
        this.executePrepared(sql, id, (result) => {
            if (!result){
                callback(false)
            } else {
                callback(true)
            }
        })
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
