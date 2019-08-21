const https = require('https')
const start = Date.now()
const fs = require('fs')
const crypto = require('crypto')

doRequest = () => {
    https.request('https://www.google.com', res => {
        res.on('data' , () => {})
        res.on('end', () => {
            console.log("https: " + Date.now() - start)
        })
    }).end()
}

doHash = () => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('hash:', Date.now() - start)
    })
}

doRequest()

fs.readFile('multitask.js', 'utf8', () => {
    console.log('FS:', Date.now() - start)
})

doHash()
doHash()
doHash()
doHash()


