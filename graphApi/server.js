const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const http = require('http')
const cors = require('cors')
const indexRouter = require('./routes/index')

const app = express()
// Gestion du tracking
// view engine setup
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.options('*', cors())
app.use(cors())
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.statusCode = 404
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render(res.err.message)
})
let port = 3001
app.set('port', port)
const server = http.createServer(app)
server.listen(port)
/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
  if (error.syscall !== 'listen') {
      throw error
  }
  let bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case 'EACCES':
          console.error(bind + ' requires elevated privileges')
          process.exit(1)
          break
      case 'EADDRINUSE':
          console.error(bind + ' is already in use')
          process.exit(1)
          break
      default:
          throw error
  }
}
// Event listener for HTTP server "listening" event.
const onListening = () => {
    console.log(`Server is listening on port : ${port}`)
}
server.on('error', onError)
server.on('listening', onListening) 


module.exports = app 