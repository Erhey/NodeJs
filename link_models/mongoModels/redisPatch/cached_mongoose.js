
const redis = require('redis')
const config = require('../../config/keys')
const redisConfig = config.redis
const client = redis.createClient(redisConfig.redisUrl)
const { promisify } = require('util')
const mongoose = require('mongoose')
const logger = require('link_logger')

client.expire = promisify(client.expire).bind(client)
client.hset = promisify(client.hset).bind(client)
client.hget = promisify(client.hget).bind(client)
client.hgetall = promisify(client.hgetall).bind(client)
client.del = promisify(client.del).bind(client)
mongoose.Query.prototype.cache = function (hashKey = {}) {
    if (this.clearCache) {
        this.useCache = false
        logger.warn('You are calling both cache and clearHash. Last call will be prioritized! : useCache')
    }
    this.clearCache = true
    this.useCache = true
    typeof hashKey === 'string' ? this.hashKey = hashKey : this.hashKey = JSON.stringify(hashKey)
    return this
}
mongoose.Query.prototype.clearHashkey = function (hashKey = {}) {
    if (this.useCache) {
        this.useCache = false
        logger.warn('You are calling both cache and clearHash. Last call will be prioritized! : clearCache')
    }
    typeof hashKey === 'string' ? this.hashKey = hashKey : this.hashKey = JSON.stringify(hashKey)
    this.clearCache = true
    return this
}
mongoose.clearHashkey = (hashKey = {}) => {
    logger.silly('Clear CACHE')
    typeof hashKey === 'string' ? 
    hashKey = hashKey: 
    hashKey = JSON.stringify(hashKey)
    client.del(hashKey)
}
const exec = mongoose.Query.prototype.exec
mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        logger.debug('Served by MONGO')
        let result = await exec.apply(this, arguments)
        if (this.clearCache) {
            logger.silly('Clear CACHE')
            client.del(this.hashKey)
        }
        return result
    }
    const field = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }))
    const cacheValue = await client.hget(this.hashKey, field)
    if (cacheValue && cacheValue !== {}) {
        logger.silly('Served by CACHE')
        const documents = JSON.parse(cacheValue)
        if (Array.isArray(documents)) {
            return documents.map(document => new this.model(document))
        } else {
            return new this.model(documents)
        }
    }
    logger.debug('Served by MONGO')
    const result = await exec.apply(this, arguments)
    client.hset(this.hashKey, field, JSON.stringify(result))
    client.expire(this.hashKey, 60)
    return result
}

module.exports = mongoose
