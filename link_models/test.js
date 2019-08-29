
const connector = require('./server')
const { responseSchema } = connector.getMongoConnection('tracking')


responseSchema.findOne({}, console.log)


// // const test = require('./schema')
// const{ connector } = require('./connection')

// let startTime = Date.now()

// // connector('jwt', async ({ connection, authenticationSchema }) => {
// //     await authenticationSchema.findOne({}, (err, authentication) => {
// //         console.log("2tesyt")
// //     })
// //     console.log("2tesyt")
// // })
// // console.log("2tesyt")

// connector("CRUD-MYSQL", result => {
//     console.log(result)
//     console.log(Date.now() - startTime)
//     result.connection.close()
//     connector("CRUD-MYSQL", result2 => {
//         console.log(result2)
//         console.log(Date.now() - startTime)
//         result2.connection.close()
//     })
// })



// // test()



// // var str = new ( "This is string" );
// // console.log("str.constructor is:" + str.constructor); 