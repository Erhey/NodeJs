let dbConnection = undefined;

try {
  let mysql = require('mysql');
  dbConnection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "nodejs_mysql"
  });
  console.log("Connected to Mysql")
} catch (err) {
	console.log(err)
}
class Dao {
	constructor() {
    if (this.constructor === Dao) {
      throw new TypeError('Abstract class "Dao" cannot be instantiated directly.'); 
    }
    this.connection = dbConnection
  }
  flag () {
    throw new Error('You must implement this method');
  }
  getAll(){
    throw new Error('You must implement this method');
  }
  find(id){
    throw new Error('You must implement this method');
  }
  getByName(name) {
    throw new Error('You must implement this method');
  }
  delete(id) {
    throw new Error('You must implement this method');
  }
  insert(Users) {
    throw new Error('You must implement this method');
  }
  update(Users) {
    throw new Error('You must implement this method');
  }
}
module.exports = Dao;