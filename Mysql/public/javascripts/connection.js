let DaoFactory = require("../../model/DaoFactory")

let Users = require("../../model/Users.js")

let UsersDao = DaoFactory.getUsersDao()

function connection() {

  let login = document.getElementById("login").value
  let password = document.getElementById("password").value
  console.log(login)
  console.log(password)
  UsersDao.checkConnection(login, password)
}

