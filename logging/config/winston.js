const appRoot = require('app-root-path')
const moment = require('moment')
var path = require('path')
const { createLogger, format, transports } = require('winston')
const { combine, label, timestamp, printf } = format

const LOG_MODE = 'DEBUG'

const myFormat = printf(({ level, message, label, timestamp }) => {
    moment().format("YYYY-MM-DD HH:mm:ss.SSS")
    return  moment().format("YYYY-MM-DD HH:mm:ss.SSS") + ` - [` + level.toUpperCase() + `] - ${label} ${message}`
})

getFileNameLineNumColNum = () => {
    if(LOG_MODE === 'DEBUG'){
        var fileName = ""
        var rowNumber
        var columnNumber
        // this is the value representing the position of your caller in the error stack.
        var currentStackPosition = 1 
        try {
            throw new Error("")
        } catch (e) {
            Error["prepareStackTrace"] = function() {
                return arguments[1] 
            }
            Error.prepareStackTrace(e, function() { })
            parts = e.stack[currentStackPosition].getFileName().split(path.sep)
            fileName = path.join(parts[parts.length - 2], parts.pop())
            rowNumber = e.stack[currentStackPosition].getLineNumber()
            columnNumber = e.stack[currentStackPosition].getColumnNumber()
        }
    return "[" + fileName + "(" + rowNumber + "," + columnNumber + ")] - "
    } else {
        return ""
    }
}
let logger = createLogger({
    transports: [
        new transports.Console(
            {
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
            }
        ),
        new transports.File({
            level: 'info',
            filename: `${appRoot}/logs/app.log`,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    format: combine(
        timestamp(),
        label({ label: getFileNameLineNumColNum() }),
        myFormat
    ),
    exitOnError: false // do not exit on handled exceptions
})
logger.stream = {
    write: (message, encoding) => {
        logger.info(message)
    }
}
module.exports = logger