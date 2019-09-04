const moment = require('moment')
const path = require('path')
const colors = require('colors')
const { createLogger, format, transports } = require('winston')
const { printf } = format

const LOG_MODE = 'DEBUG'


const MAP_PROJECT_SERVER = {
    '[AJAX_DB]': 'localhost:3002'
    , '[CRUD_MYSQL]': 'localhost:3000'
    , '[GRAPHAPI]': 'localhost:3001'
    , '[JWTGENERATOR]': 'localhost:3003'
    , '[JWTMANAGER]': 'localhost:3004'
    , '[LINK_ERROR]': 'helper-module'
    , '[LINK_JWT]': 'helper-module'
    , '[LINK_LOGGER]': 'helper-module'
    , '[LINK_MODELS]': 'helper-module'
    , '[LINK_TRACKER]': 'helper-module'
}
const LEVEL_LOGS_COLORS = {
    error: 'red'
    , warn: 'yellow'
    , info: 'green'
    , verbose: 'cyan'
    , debug: 'blue'
    , silly: 'rainbow'
}


const myConsoleFormat = printf(({ level, message }) => {
    if (typeof message === 'object') {
        message = colorify(JSON.stringify(message, null, 4), level)
    } else {
        message = colorify(message, level)
    }
    switch (level) {
        case 'error':
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - ' + '['.red + level.toUpperCase().red.bold.underline + ']'.red + ' - ' + message
        case 'warn':
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - ' + '['.yellow + level.toUpperCase().yellow.bold.underline + ']'.yellow + ' - ' + message
        case 'info':
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - ' + '['.green + level.toUpperCase().green.bold.underline + ']'.green + ' - ' + message
        case 'verbose':
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - ' + '['.cyan + level.toUpperCase().cyan.bold.underline + ']'.cyan + ' - ' + message
        case 'debug':
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - ' + '['.blue + level.toUpperCase().blue.bold.underline + ']'.blue + ' - ' + message
        case 'silly':
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - ' + '['.rainbow + level.toUpperCase().rainbow.bold.underline + ']'.rainbow + ' - ' + message
        default:
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS').blue + ' - [' + level.toUpperCase().bold.underline + '] - ' + message
    }
})
const myFileFormat = printf(({ level, message }) => {
    if (typeof message === 'object') {
        return moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' - ' + '[' + level.toUpperCase() + ']'.red + ' - ' + JSON.stringify(message, null, 4)
    } else {
        return moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' - ' + '[' + level.toUpperCase() + ']' + ' - ' + message
    }
})


getMainDirectory = () => {
    // return __dirname
    return __dirname.trim().match(/^(.*\\)[^\\]+$/)[1] + 'main'
}

let logger = createLogger({
    transports: [
        new transports.Console({
            level: 'silly',
            handleExceptions: true,
            json: false,
            format: myConsoleFormat
        }),
        new transports.File({
            level: 'debug',
            filename: `${getMainDirectory()}/logs/app.log`,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: myFileFormat
        }),
        new transports.File({
            level: 'error',
            filename: `${getMainDirectory()}/logs/error.log`,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: myFileFormat
        })
    ],
    exitOnError: false // do not exit on handled exceptions
})





/***************** Internal functions ****************/
colorify = (message, level) => {
    let splitted = message.split(' - ')
    message = `${splitted[0]} - `.magenta + `${splitted[1]} - `.cyan + `${splitted[2]} - `.yellow + `${splitted[3]} - `[LEVEL_LOGS_COLORS[level]]
    return message
}
getErrorObject = () => {
    try { throw Error('') } catch (err) { return err }
}

custoLoggerFunction = (fn, callback, color) => {
    return (message) => {
        if (typeof message === 'string') {
            fn(callback() + ' - ' + message)
        }
        else if (typeof message === 'object') {
            fn(callback() + ' - ' + JSON.stringify(message, null, 4))
        } else {
            fn(callback() + ' - ' + message.toString())
        }
    }
}

getSourceProjectName = clean => {
    let cleaner = clean
    let match = clean.match(/.*\(([^\(\)]*)\)/)
    if (match) {
        cleaner = match[1]
    }
    let cuttedPath = cleaner.replace(path.dirname(__dirname), '')
    let sourceProjectName = cuttedPath.trim().match(/^\\([^\\]+)/)[1]
    return `[${sourceProjectName.toUpperCase()}]`
}


appendFunc = () => {
    if (LOG_MODE === 'DEBUG') {
        let err = getErrorObject()
        let caller_line = err.stack.split('\n')[4]
        let index = caller_line.indexOf('at ')
        let clean = caller_line.slice(index + 2, caller_line.length)
        let sourceProject = getSourceProjectName(clean)
        let server = getServer(sourceProject)
        return `${sourceProject} - ${server} -  ${clean}`
    } else {
        return ''
    }
}

getServer = sourceProject => {
    let server = MAP_PROJECT_SERVER[sourceProject]
    if (server !== undefined) {
        return server
    }
    else {
        return 'server not found'
    }
}
/***************** Internal functions ****************/



logger.error = custoLoggerFunction(logger.error, appendFunc, LEVEL_LOGS_COLORS.error)
logger.warn = custoLoggerFunction(logger.warn, appendFunc, LEVEL_LOGS_COLORS.warn)
logger.info = custoLoggerFunction(logger.info, appendFunc, LEVEL_LOGS_COLORS.info)
logger.verbose = custoLoggerFunction(logger.verbose, appendFunc, LEVEL_LOGS_COLORS.verbose)
logger.debug = custoLoggerFunction(logger.debug, appendFunc, LEVEL_LOGS_COLORS.debug)
logger.silly = custoLoggerFunction(logger.silly, appendFunc, LEVEL_LOGS_COLORS.silly)

logger.stream = {
    write: (message, encoding) => {
        logger.info(message)
    }
}
module.exports = logger