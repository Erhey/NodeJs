let dbConnection = undefined;

try {
    let mysql = require('mysql');
    dbConnection = mysql.createPool({
        host : "localhost",
        user : "root",
        password : "",
        database : "nodejs_mysql"
    });
} catch (err) {
	console.log(err)
}
class Dao {
	constructor(db) {
    if (this.constructor === Dao) {
      throw new TypeError('Abstract class "Dao" cannot be instantiated directly.'); 
    }
    console.log("test")
   	dbConnection.getConnection((err, db) => {
      console.log(err)
			if (err) {
				// return callback(err); //TODO: Proper error-handling
				console.log("ERROR: getConnection failed: err = " + err);
			}
      console.log("je passe")
      this.db = db
		});
  }
  flag () {
    throw new Error('You must implement this method');
  }
  getAll(){
    throw new Error('You must implement this method');
  }
}
module.exports = Dao;