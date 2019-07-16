var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

let options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    },
}
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `[` + level.toUpperCase() + `]	- ${timestamp}: - ${message}`;
});
let logger = createLogger({
    transports: [
        new transports.Console(options.console)
    ],
    format: combine(
        timestamp(),
        myFormat
    ),
    exitOnError: false // do not exit on handled exceptions
});
module.exports = function (module) {

    var filename = module.id;
    console.log(filename)
    return {
        info: function (msg, vars) {
            logger.info(filename + ': ' + msg, vars);
        }
    }
};




