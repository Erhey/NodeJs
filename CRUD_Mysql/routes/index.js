
// import UserDao from '../models/userDao';
let UserDao = require("../models/userDao");

let express = require('express');
let router = express.Router();

let user_controller = require("../controllers/userController")
let userDao = new UserDao()

/* GET users listing. */
router.get('/', user_controller.index)
router.get('/user', (req, res, next) => {
  res.send("Je suis connecte!!!")
})

router.post('/login', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  console.log(userDao)
  let passport = userDao.checkLogin(login, password)
  if(passport === true){
    res.redirect('/user/?passport=true');
  } else {
    res.redirect('/')
  }
});

module.exports = router;
