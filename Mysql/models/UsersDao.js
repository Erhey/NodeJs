let Dao = require("./Dao")

class UsersDao extends Dao {
  constructor(){
    super()
  }
  getAll() {
    this.connection.query("select * from Users", [], (err, result) => {
      console.log(result)
    });
  }
  find(id) {
    this.connection.query("select * from Users where id = ?", id, (err, result) =>{
      if (err) console.log(err)
      console.log(result)
    })
  }
  getByName(name) {
    this.connection.query("select * from Users where name like ?", '%' + name + '%', (err, result) =>{
      if (err) console.log(err)
      console.log(result)
    })
  }
  delete(id) {
    this.connection.query("delete from Users where id = ?", id, (err, result) =>{
      if (err) console.log(err)
      console.log(result)
    })
  }
  checkConnection(login, password){
    this.connection.query("select count(*) Users where login = ? AND password = ?", [id, password], (err, result) =>{
      if (err) console.log(err)
      console.log(result)
    })
  }
  update(Users) {
    this.connection.query("UPDATE USERS SET login = ?, " + 
                                            "password = ?, " + 
                                            "Name = ?, " + 
                                            "FirstName = ?, " + 
                                            "tel = ?, " + 
                                            "mail = ?, " + 
                                            "lastConDate = ?, " + 
                                            "createdDay = ?, " + 
                                            "isDelete = ? " + 
                                        "where id = ?", 
                                        [Users.login, 
                                         Users.password, 
                                         Users.Name, 
                                         Users.FirstName, 
                                         Users.tel, 
                                         Users.mail, 
                                         Users.lastConDate, 
                                         Users.createdDay, 
                                         Users.isDelete,
                                         Users.id], (err, result) =>{
      if (err) console.log(err)
      console.log(result)
    })
  }

  insert(Users) {
    this.connection.query("INSERT INTO Users (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) " +
                                      "VALUES (?,?,?,?,?,?,?,?)", [Users.login, 
                                                                   Users.password, 
                                                                   Users.Name, 
                                                                   Users.FirstName, 
                                                                   Users.tel, 
                                                                   Users.mail, 
                                                                   Users.lastConDate, 
                                                                   Users.createdDay], (err, result) =>{
    if (err) console.log(err)
    console.log(result)
    })
  }
  flag(){
    console.log("UsersDao class ～call")
  }
}
module.exports = UsersDao; 
