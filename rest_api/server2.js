// const express = require("express")
// var cookieParser = require('cookie-parser')
// let moment = require("moment")
// var app = express()
// app.use(cookieParser())

// // //JSON object to be added to cookie 
// // let users = { 
// //     name : "Ritik", 
// //     Age : "18"
// //     } 
      
// //     //Route for adding cookie 
// //     app.get('/setuser', (req, res)=>{ 
// //     res.cookie("userData", users); 
// //     res.send('user data added to cookie'); 
// //     }); 
      
// app.use("/", (req, res, next) => {
//   console.log("tst")
//   next()
// })
// app.get("/", (req, res) => {
//   res.send("salueet")
// })
// // app.get('/getcookie', function(req, res) {

// //     res.send(req.cookies['userData']);
// // });

// app.post("/error", (req, res) => {
//   res.statusCode = 404
//   res.errorMes = "Could not find page error"
//   let json = createJson(req, res)
  
//   res.send(json)
// })


// createJson = (req, res) => {
//   jsonTracking = {}
//   jsonTracking.timestamp = moment().format()
//   jsonTracking.user_id = "mockID"
//   if(res.statusCode !== 200) {
//     jsonTracking.error = {}
//     jsonTracking.error.statusCode = res.statusCode
//     jsonTracking.error.message = res.errorMes
//   }
//   jsonTracking.req = {}
//   jsonTracking.req.body = req.body
//   jsonTracking.req.action = req.path
//   jsonTracking.req.method = req.method
//   jsonTracking.res = {}
//   jsonTracking.res.body = res.locals
//   jsonTracking.res.action = res.path
//   return jsonTracking
// }






// app.get('/req', (req, res) => {
// //   let reqContentJson = {}
// //   reqContentJson.body = req.body
// //   reqContentJson.cookies = req.cookies
// //   reqContentJson.headers = req.headers
// //   reqContentJson.method = req.method
// //   reqContentJson.next = req.next
// //   reqContentJson.params = req.params
// //   reqContentJson.query = req.query
// //   reqContentJson.readable = req.readable
// //   reqContentJson.route = req.route
// //   reqContentJson.signedCookies = req.signedCookies
// //   reqContentJson.url = req.url
     
//   res.send(JSON.stringify(req.params))
// })
// // app.get('/res', (req, res) => {
// //   req.body = {}
// //   req.body.test = "test"
// //   let resContentJson = {}
// //   resContentJson.app = res.app
// //   resContentJson.chunkedEncoding = res.chunkedEncoding
// //   resContentJson.finished = res.finished
// //   resContentJson.output = res.output
// //   resContentJson.outputEncodings = res.outputEncodings
// //   resContentJson.sendDate = res.sendDate
// //   resContentJson.shouldkeepAlive = res.shouldkeepAlive
// //   resContentJson.useChunkedEncdoingByDefault = res.useChunkedEncdoingByDefault
// //   resContentJson.viewCallbacks = res.viewCallbacks
// //   resContentJson.writable = res.writable

// //   res.send(JSON.stringify)
// // })
//   app.listen(8080)