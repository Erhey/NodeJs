let DaoFactory = require("../../model/DaoFactory")

let usersDao = DaoFactory.getUsersDao()



console.log(usersDao)

usersDao.getAll()  
 