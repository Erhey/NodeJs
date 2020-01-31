const redisUtils = require('./cacheUtil')
const uuidv4 = require('uuid/v4')







let uuidv4
if (req.cookies === undefined || req.cookies.cache_uuid === undefined) {
    uuidv4 = uuidv4()
    res.cookie('cache_uuid', uuidv4());
} else {
    uuidv4 = req.cookies.cache_uuid
}


module.exports = {
    isCache: true
    , saveToCache: (key, field, result) => {
        if (this.isCache) {
            if (typeof result === 'object') {
                redisUtils.hset(key, field, JSON.stringify(result))
            } else {
                redisUtils.hset(key, field, result)
            }
        }
    }
    , getFromCache: async (key, field = "") => {
        if (this.isCache) {
            return await redisUtils.hget(key, field)
        }
    }
    , patchConfig: (connection, confType) => {
        if(isMongoDb){

        } else if (isMysql) {
            conne

        }
    }
    , c
    , cleanCacheAfter: (req, res, next) => {
        await next()
        this.cleanCache(req, res, next)
    },
    cleanCache: (req, res, next) => {

    },
    clearCache: hashKey => {
        redisUtils.del(hashKey)
    }
}
app.use("/", (req, res, next) => {
    if (req.cookies === undefined || req.cookies.user_token === undefined) {
        res.cookie('user_token', uuidv4());
    }
    next()
})



// (async () => {
//     try {
//         const { hset, hget } = require('./cacheRedisUtils')
//         // level 1
//         await hset("f/J", "manger", "食べる")
//         await hset("f/J", "boire", "飲む")
//         await hset("f/J", "marcher", "歩く")
//         await hset("f/J", "danser", "踊る")
//         await hset("f/J", "voir", "見る")
//         let hgettedValue3 = await hget("f/J", "manger")
//         console.log(hgettedValue3)
//     } catch(e) {
//         console.log(e)
//     }
// })()
