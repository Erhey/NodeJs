class UsersDaoMysql extends UsersDao {
	getAll(callback) {
		this.uow.query("select * from movie", [], (result) => {
			return callback(result);
		});
	}
}