const link_model = require('./app')

const mongoose = link_model.getMongoConnection('tracking')

testPerfoWithoutCache = async() => {
    const result = await  mongoose.requestSchema.find({})//.cache("ABDXE")
}


testPerfoWithCache = async() => {
    await mongoose.requestSchema.find({}).clearHashkey("ABDXE")
    // console.log(await mongoose.requestSchema.find({}).cache("ABDXE"))
}


test = async () => {
    try {
        console.log(result)
    } catch (e) {
        console.log(e)
    }
}

test2 = async () => {
    const cacheUtil = require('./cache/cacheUtil')
    console.log(await cacheUtil.hgetall("ABDXE"))
}

(async () => {

    await testPerfoWithCache()
    await testPerfoWithCache()
    await testPerfoWithCache()
    
})()




