

let DaoFactory = require("../../model/DaoFactory")

let Users = require("../../model/Users.js")

let UsersDao = DaoFactory.getUsersDao()

function connection() {

  let login = document.getElementById("txtLogin").value
  let password = document.getElementById("txtPassword").value
  console.log(login)
  console.log(password)
}

const btnLogin = document.getElementById("btnLogin")
btnLogin.onclick = (login, password) => {
  let checked = UsersDao.checkConnection(login, password)
  if(checked === 1){
    console.log("connection Success!")
  } else {
    console.log("connection Failed!")
  }
}



var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  
  res.render('index', { title: 'Express' })
});
router.post('/login', function(req, res, next) {
  let loginSuccess = UsersDao.checkConnection(login, password)
  if(loginSuccess){
    res.redirect('/', { title: 'Express' });
  } else {
    res.redirect('/login', { title: 'Express' })
  }
});



module.exports = router;

