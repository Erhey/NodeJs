let g_database = undefined

let mysql = require("mysql")


g_database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_mysql'
});

g_database.on('error', err => {
    console.log(err)
})

class Dao {
    constructor(){
        if(this.constructor === Dao){
            throw new TypeError("Dao's constructor should not be called directly. Use extended classes")
        }
        this.db = g_database
    }
    find(id){
        throw new TypeError("Dao's find method cannot be called directly. Implement it in child classes.")
    }
}


module.exports = Dao