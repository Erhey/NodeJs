const mysql = require('mysql')

const config = require('../../config/keys')
let galaxyBreakerConfig = config.galaxy_breaker

module.exports = mysql.createConnection({
    host: galaxyBreakerConfig.host
    , database: galaxyBreakerConfig.database
    , user: galaxyBreakerConfig.user
    , password: galaxyBreakerConfig.password
})
