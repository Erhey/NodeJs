

let UsersDao = require("./UsersDao");
class DaoFactory {

  constructor(){}


	static getUsersDao() {
    return new UsersDao();
	}
  static flag(){
    console.log("test");

  }
	static getUsersDetailDao() {
		return new UsersDao()
	}
}
module.exports = DaoFactory;
