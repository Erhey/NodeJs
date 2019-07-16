var logger = require('./winston')
const moment = require('moment')
let time_before = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
// for (let i = 0; i < 100000; i++){
    logger.error('foo')
// }
logger.error(time_before)