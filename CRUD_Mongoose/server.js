const createError = require('http-errors')
const express = require('express')
const debug = require('debug')('app:server')
const http = require('http')
const path = require('path')

let app = express()

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/user", userRouter)
app.use("/", indexRouter)
app.use((req, res, next) => {
    console.log("test")
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


