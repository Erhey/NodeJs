let dbConnection = undefined;

try {
    case "mysql":
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
	static create(callback) {
		dbConnection.getConnection((err, connection) => {
			if (err) {
				//return callback(err); //TODO: Proper error-handling
				console.log("ERROR: getConnection failed: err = " + err);
			}
			uow = new MySqlUnitOfWork(connection);
			return callback(uow);
		});
		break;
	}
}
module.exports = Dao;