const logger = require('link_logger')
const http = require('http')
const createError = require('http-errors')
const express = require('express')
const JWTController = require('./controllers/JWTController')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.options('*', cors())
app.use(cors())
app.post('/getAccessToken', function (req, res, next) {
    JWTController.getAccessToken(req.body.login, req.body.password, result => {
        res.send(result)
    })
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.statusCode = 404
    next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render(res.error.message)
})
const port = 3003
app.set('port', port)

/**
 * Create HTTP server.
 */
let server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
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

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address()
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    logger.debug('Listening on ' + bind)
}