var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http')
var trackingApiRouter = require('./routes/trackingApi');

var app = express();
// Gestion du tracking
// view engine setup

// utile?
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/trackingApi', trackingApiRouter)
let port
if(!isNaN(process.env.PORT)){
    port = process.env.PORT
} else {
    port = 3000
}
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening); 

// Event listener for HTTP server "listening" event.
function onListening() {
    console.log("Server is listening on port : " + port)
}
module.exports = app; 
