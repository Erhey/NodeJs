let UserDao = require("../models/userDao");
let UserBean = require("../models/userBean");
let userDao = new UserDao()


// Display list of all books.
exports.index = function(req, res) {
    res.render('userMng')
}
exports.createUser_get = function(req, res) {
  res.render('createUser')
}
exports.createSuccess = function(req, res) {
  res.render('createSuccess')
}
exports.createFail = function(req, res) {
  res.render('createFail')
}
exports.createUser_post = function(req, res) {
    

  let login = req.body.Login
  let password = req.body.Password
  let name = req.body.Name
  let firstName = req.body.FirstName
  let tel = req.body.Telephone
  let mail = req.body.Mail

  let tset = new UserBean(login, password, name, firstName, tel, mail)
  userDao.insert(tset, (state, result=null) => {
    if(state === true){
      res.redirect('/userMng/createSuccess');
    } else {
      console.log(result)
      res.redirect('/userMng/createFail')
    }
  })
}