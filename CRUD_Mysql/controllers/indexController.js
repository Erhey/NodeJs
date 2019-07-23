
let UserDao = require("../models/userDao");
let userDao = new UserDao()




exports.index = function(req, res) {
  console.log(req.connection.remoteAddress)
  res.render('index')
};

exports.unauthorized = function(req, res) {
  res.render('unauthorized')
};

exports.login_get = function(req, res) {
    res.render('login')
};
exports.login_post = function(req, res) {
  let login = req.body.login
  let password = req.body.password
  userDao.checkLogin(login, password, result => {
    console.log(result)
    if(result){
      console.log("test")
      res.cookie("user_token", result)
      res.cookie("is_connected", true)
      res.redirect('/userMng');
    } else {
      console.log("test2")
      res.redirect('/unauthorized')
    }
  })
};

