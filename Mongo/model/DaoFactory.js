class DaoFactory {
	static getUsersDao() {
		return new UsersDao()
	}
	static getUsersDetailDao() {
		return new UsersDao()
	}
}