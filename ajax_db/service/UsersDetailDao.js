class UsersDetailDao {
  constructor(db) {
    this.db = db
  }
  getAll(callback) {
    this.db.query("select * from UsersDetail", [], (result) => {
      return callback(result);
    });
  }
}