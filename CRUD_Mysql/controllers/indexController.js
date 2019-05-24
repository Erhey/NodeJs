
let UserDao = require("../models/userDao");
let userDao = new UserDao()




exports.index = function(req, res) {
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

    if(result === 1){
      res.redirect('/userMng');
    } else {
      res.redirect('/unauthorized')
    }
  })
};

