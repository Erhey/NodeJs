let DaoFactory = require("../../model/DaoFactory")

let Users = require("../../model/Users.js")

let users = new Users("ins_login", "ins_password", "ins_Name", "ins_FirstName", 12345679, "ins_mail", "2019-05-21", "2019-05-21", "0", "3")

let usersDao = DaoFactory.getUsersDao()
  
// usersDao.getByName("Martin")
// usersDao.delete(5)

usersDao.insert(users)