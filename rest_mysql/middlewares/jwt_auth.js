const jwt = require('jsonwebtoken');
const config = require('../conf.json');
const logger = require("link_logger")(__filename)
module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No JWT provided.');
    }
    logger.info(config.PrivateKey)
    logger.info(token)

    try {
        logger.info(config.PrivateKey)
        logger.info(token)
        const decoded = jwt.verify(token, config.PrivateKey);
        logger.info(decoded)
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid JWT.');
    }
}