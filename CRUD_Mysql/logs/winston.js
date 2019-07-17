const appRoot = require('app-root-path')
const moment = require('moment')
var path = require('path')
const colors = require("colors")
const { createLogger, format, transports } = require('winston')
const { combine, label, printf } = format

const LOG_MODE = 'DEBUG'

const myFormat = printf(({ level, message, label }) => {
    return  moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - [" + level.toUpperCase().magenta.bold.underline + "] - " + label + message.green
})

getFileName = fileName => {
    if(LOG_MODE === 'DEBUG'){
        return "(" + fileName.replace(appRoot.path, "").substring(1).yellow + ") - "
    } else {
        return ""
    }
}
let logger = (fileName) => (
    createLogger ({
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
        label({ label: getFileName(fileName) }),
        myFormat
    ),
    exitOnError: false // do not exit on handled exceptions
})
)
logger.stream = {
    write: (message, encoding) => {
        logger.info(message)
    }
}
module.exports = logger