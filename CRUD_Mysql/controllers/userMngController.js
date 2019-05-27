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
exports.searchUser_get = function(req, res) {
  res.render('searchUser', {});
}
exports.searchUser_post = function(req, res) {
  userDao.searchUser(req.body, (result) =>{
    if (!result){
      res.render('searchUser', { "err" : "Users not found" })
    } else {
      res.render('searchUser', { "users" : result })
    }
  })
}
exports.deleteUser_post = function(req, res) {
  console.log("deleteUser_get ID = " + req.body.id)
  res.render('deleteUser', {"user" : req.body})
}
exports.deleteConfirmUser_post = function(req, res) {
  console.log("deleteUser_post ID = " + req.body.id)
  userDao.delete(req.body.id, (success) => {
    if (success) res.render('deleteUser_success')
    else res.render('deleteUser_fail')
  })
}
exports.updateUser_post = function(req, res) {
  console.log("updateUser_get   ID = " + req.body.id)
  console.log(req.body)
  res.render('updateUser', {"user" : req.body})
}
exports.updateConfirmUser_post = function(req, res) {
  console.log("updateUser_post   ID = " + req.body.id)
  userDao.update(req.body, (success) => {
    if (success) res.render('updateUser_success')
    else res.render('updateUser_fail')
  })
}
exports.createUser_post = function(req, res) {
    

  let login = req.body.Login
  let password = req.body.Password
  let name = req.body.Name
  let firstName = req.body.FirstName
  let tel = req.body.Telephone
  let mail = req.body.Mail

  let userBean = new UserBean(login, password, name, firstName, tel, mail)
  userDao.insert(userBean, (state, result=null) => {
    if(state === true){
      res.redirect('/userMng/createSuccess');
    } else {
      console.log(result)
      res.redirect('/userMng/createFail')
    }
  })
}