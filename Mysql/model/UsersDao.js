let Dao = require("./Dao")

class UsersDao extends Dao {

  getAll(callback) {
    this.db.query("select * from Users", [], (result) => {
      console.log(result);
    });
  }
  flag(){
    console.log("UsersDao class ～call")
  }
}
module.exports = UsersDao;
