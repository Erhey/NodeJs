const createError = require('http-errors')
const express = require('express')

const http = require('http')
const cors = require('cors')
const indexRouter = require('./routes/index')
const app = express()
const logger = require('link_logger')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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
  logger.error(err)
  res.send(err)
})
let port
if(!isNaN(process.env.PORT)){
    port = process.env.PORT
} else {
    port = 3005
}
app.set('port', port)
let server = http.createServer(app)
server.listen(port)
server.on('listening', onListening) 

// Event listener for HTTP server 'listening' event.
function onListening() {
    logger.info('Server is listening on port : ' + port)
}

module.exports = app 