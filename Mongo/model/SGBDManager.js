const SGBD = "mongo"
let dbConnection = undefined;

switch (SGBD) {
	try {
        case "mock":
            console.log("Mock data source selected");
            break;
        case "mysql":
            let mysql = require('mysql');
            _dbConnection = mysql.createPool({
                host : "localhost",
                user : "root",
                password : "",
                database : "nodejs_mysql"
            });
            break;
        case "mongo":
            let url = "mongodb://localhost:27017"
            mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
              if (err) {
                throw err
              }
              else {
                _dbConnection = db
              }
            })
            break;
        default:
        	throw "ERROR: This database type is not supported!";
    } catch (err) {
    	console.log(err)
    }
}
class UnitOfWorkFactory {
	static create(callback) {
		let uow = undefined;
		switch (config.DbType) {
			case "mock":
				let MockUnitOfWork = require("./MockUnitOfWork");
				uow = new MockUnitOfWork();
				return callback(uow);
				break;
			case "mysql":
				let MySqlUnitOfWork = require("./MySqlUnitOfWork");
				_dbConnection.getConnection((err, connection) => {
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
}

module.exports = UnitOfWorkFactory;