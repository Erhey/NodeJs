const express = require("express")
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser())

//JSON object to be added to cookie 
let users = { 
    name : "Ritik", 
    Age : "18"
    } 
      
    //Route for adding cookie 
    app.get('/setuser', (req, res)=>{ 
    res.cookie("userData", users); 
    res.send('user data added to cookie'); 
    }); 
      

app.get('/getcookie', function(req, res) {

    res.send(req.cookies['userData']);
});
  app.listen(8080)