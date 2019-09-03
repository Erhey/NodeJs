var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var http = require('http')
var cors = require('cors')

var indexRouter = require('./routes/index')

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.options('*', cors())
app.use(cors())
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.statusCode = 404
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(res.err)
})
let port
if(!isNaN(process.env.PORT)){
    port = process.env.PORT
} else {
    port = 3002
}
app.set('port', port)
var server = http.createServer(app)
server.listen(port)
server.on('listening', onListening) 

// Event listener for HTTP server 'listening' event.
function onListening() {
    console.log('Server is listening on port : ' + port)
}


module.exports = app 