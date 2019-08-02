const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const http = require('http')
const indexRouter = require('./routes/index')

const app = express()

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded( { extended: false } ))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
let port
if(!isNaN(process.env.PORT)){
    port = process.env.PORT
} else {
    port = 4000
}
app.set('port', port)
var server = http.createServer(app)
server.listen(port)
server.on('listening', onListening) 

// Event listener for HTTP server "listening" event.
function onListening() {
    console.log("Server is listening on port : " + port)
}

module.exports = app
