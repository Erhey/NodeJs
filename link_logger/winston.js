const appRoot = require('app-root-path')
const moment = require('moment')
var path = require('path')
const colors = require("colors")
const { createLogger, format, transports } = require('winston')
const { combine, label, printf } = format

const LOG_MODE = 'DEBUG'

const myFormat = printf(({ level, message }) => {
    if(typeof message === "object"){
        switch(level) {
            case 'error':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".red + level.toUpperCase().red.bold.underline + "]".red + " - " + JSON.stringify(message, null, 4)
            case 'warn':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".yellow + level.toUpperCase().yellow.bold.underline + "]".yellow + " - " + JSON.stringify(message, null, 4)
            case 'info':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".green + level.toUpperCase().green.bold.underline + "]".green + " - " + JSON.stringify(message, null, 4)
            case 'verbose':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".cyan + level.toUpperCase().cyan.bold.underline + "]".cyan + " - " + JSON.stringify(message, null, 4)
            case 'debug':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".blue + level.toUpperCase().blue.bold.underline + "]".blue + " - " + JSON.stringify(message, null, 4)
            case 'silly':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".rainbow + level.toUpperCase().rainbow.bold.underline + "]".rainbow + " - " + JSON.stringify(message, null, 4)
            default:
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - [" + level.toUpperCase().bold.underline + "] - " + JSON.stringify(message, null, 4)
        }
    } else {
        switch(level) {
            case 'error':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".red + level.toUpperCase().red.bold.underline + "]".red + " - " + message
            case 'warn':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".yellow + level.toUpperCase().yellow.bold.underline + "]".yellow + " - " + message
            case 'info':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".green + level.toUpperCase().green.bold.underline + "]".green + " - " + message
            case 'verbose':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".cyan + level.toUpperCase().cyan.bold.underline + "]".cyan + " - " + message
            case 'debug':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".blue + level.toUpperCase().blue.bold.underline + "]".blue + " - " + message
            case 'silly':
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - " + "[".rainbow + level.toUpperCase().rainbow.bold.underline + "]".rainbow + " - " + message
            default:
                return moment().format("YYYY-MM-DD HH:mm:ss.SSS").blue + " - [" + level.toUpperCase().bold.underline + "] - " + message
        }
    }
})


function getErrorObject(){
    try { throw Error('') } catch(err) { return err; }
}



getFileName = fileName => {

    if(LOG_MODE === 'DEBUG'){
        return "(~/".yellow + fileName.replace(path.dirname(appRoot.path), "").substring(1).replace("\\", "/").yellow + ")".yellow + " - "
    } else {
        return ""
    }
}
let logger = 
// (fileName) => (
    createLogger ({
    transports: [
        new transports.Console(
            {
                level: 'silly',
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
        myFormat
    ),
    exitOnError: false // do not exit on handled exceptions
})
custoLoggerFunction = (fn, callback, color) => {
    return (message) => {
        if (typeof message === "string") {
            fn(callback() + " - " + message[color])
        }
        else if (typeof message === "object"){
            fn(callback() + " - " + JSON.stringify(message, null, 4)[color])
        } else {
            fn(callback() + " - " + message.toString()[color])
        }
    }
}

appendFunc = () => {
    if(LOG_MODE === 'DEBUG'){
        let err = getErrorObject()
        let caller_line = err.stack.split("\n")[4]
        let index = caller_line.indexOf("at ")
        let clean = caller_line.slice(index+2, caller_line.length)
        return clean.yellow
    } else {
        return ""
    }
}


logger.error = custoLoggerFunction(logger.error, appendFunc, "red")
logger.warn = custoLoggerFunction(logger.warn, appendFunc, "yellow")
logger.info = custoLoggerFunction(logger.info, appendFunc, "green")
logger.verbose = custoLoggerFunction(logger.verbose, appendFunc, "cyan")
logger.debug = custoLoggerFunction(logger.debug, appendFunc, "blue")
logger.silly = custoLoggerFunction(logger.silly, appendFunc, "rainbow")

logger.stream = {
    write: (message, encoding) => {
        logger.info(message)
    }
}
module.exports = logger