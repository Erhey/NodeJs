const appRoot = require('app-root-path')
const moment = require('moment')
var path = require('path')
const colors = require("colors")
const { createLogger, format, transports } = require('winston')
const { combine, label, printf } = format

const LOG_MODE = 'DEBUG'

const myFormat = printf(({ level, message, label }) => {
    switch(level) {
        case 'error':
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".red + level.toUpperCase().red.bold.underline + "]".red + " - " + label + message.red
        case 'warn':
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".yellow + level.toUpperCase().yellow.bold.underline + "]".yellow + " - " + label + message.yellow
        case 'info':
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".green + level.toUpperCase().green.bold.underline + "]".green + " - " + label + message.green
        case 'verbose':
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".cyan + level.toUpperCase().cyan.bold.underline + "]".cyan + " - " + label + message.cyan
        case 'debug':
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".blue + level.toUpperCase().blue.bold.underline + "]".blue + " - " + label + message.blue
        case 'silly':
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".rainbow + level.toUpperCase().rainbow.bold.underline + "]".rainbow + " - " + label + message.rainbow
        default:
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - [" + level.toUpperCase().bold.underline + "] - " + label + message
      }
})

getFileName = fileName => {
    if(LOG_MODE === 'DEBUG'){
        return "(~\\".yellow + fileName.replace(path.dirname(appRoot.path), "").substring(1).yellow + ")".yellow + " - "
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