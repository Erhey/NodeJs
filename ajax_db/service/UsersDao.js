class UsersDao {
  constructor(db) {
    this.db = db
  }
  getAll(callback) {
    this.db.query("select * from Users", [], (result) => {
      return callback(result);
    });
  }
}