
const redis = require('redis')
const config = require('../config/keys')
const redisConfig = config.redis
const client = redis.createClient(redisConfig.redisUrl)
const { promisify } = require('util')
promisify(client.hget).bind(client)
promisify(client.hgetall).bind(client)



module.exports = {
    redisConfig: redisConfig
    ,expire: promisify(client.expire).bind(client)
    ,hset: promisify(client.hset).bind(client)
    ,hget: promisify(client.hget).bind(client)
    ,hgetall: promisify(client.hgetall).bind(client)
    ,del:promisify(client.del).bind(client)
}

