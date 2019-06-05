const express = require("express")
const cookieParser = require('cookie-parser')
const CreateError = require("http-errors")
const path = require("path")
const colors = require("colors")
const http = require("http")
const mongoDb = require("./trackingSystem/track")

// const conn_mongo = require("./models/connection")
let trackingApiRouter = require("./routers/trackingApi")

const app = express()

app.use("/", (req, res, next) => {
  res.statusCode = 200
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.use("/trackingApi/", trackingApiRouter)

app.use((req, res, next) => {
    res.statusCode = 200
    mongoDb.createTrack(req, res)
    res.send('Salut');
})

app.use((req, res, next) => {
  console.log("test")
  mongoDb.createTrack(req, res)
  next(createError(404))
})
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.set('port', 3000);
var server = http.createServer(app).listen(3000, () =>{
  console.log("Server is listening on port : " + 3000)
});
