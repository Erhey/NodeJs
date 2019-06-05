const express = require("express")
const cookieParser = require('cookie-parser')
const CreateError = require("http-errors")
const path = require("path")
const colors = require("colors")
const http = require("http")
const track = require("./track/DAO/track")
// const conn_mongo = require("./models/connection")
let trackingApiRouter = require("./routes/trackingApi")
const app = express()
app.set('view engine', 'ejs');


// Gestion du tracking
app.use("/", (req, res, next) => {
  track.request(req)
  console.log(track.link_id)
  res.on('finish', function(){
    track.response(res)
  })
  next()
})

// ↓↓↓↓↓↓↓ middleware utilise par l'application
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())



app.use("/", trackingApiRouter)
app.use((req, res, next) => {
  console.log("test")
  next(CreateError(404))
})
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
})

app.set('port', 3000);
var server = http.createServer(app).listen(3000, () =>{
  console.log("Server is listening on port : " + 3000)
})
