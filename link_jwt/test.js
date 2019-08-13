const fs = require('fs')
const jwtManager = require("./jwt/jwtManager")
const jwtController = require("./jwt/jwtController")
const options = {
  key: fs.readFileSync("./privkey.pem", "utf8"),
  cert: fs.readFileSync("./pubkey.pem", "utf8")
};


// let token = jwtManager.sign({"user" : "test" }, { issuer: "Authorization/Resource/mysqldb", subject: "kevin.martin.eng@outlook.com" })
// let decodedToken  = jwtManager.verify(token, { issuer: "Authorization/Resource/mysqldb", subject: "kevin.martin.eng@outlook.com" })
// let decodeFunc = jwtManager.decode(token)

// console.log("token: ", token)
// console.log("decodedToken: ", decodedToken)
// console.log("decodeFunc: ", decodeFunc)

// jwtController.createAccount("test5", "test7", "test", (result) => {
//   console.log(result)
// })
