const mysql = require('mysql')

const config = require('../../config/keys')
let wampConfig = config.wamp

module.exports = mysql.createConnection({
    host: wampConfig.host
    , database: wampConfig.database
    , user: wampConfig.user
    , password: wampConfig.password
})