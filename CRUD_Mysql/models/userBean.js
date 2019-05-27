class UserBean {
    constructor(login, password, name, firstName, tel, mail, lastConDate="", createdDay="", isDelete="", id="") {
        this.id = id
        this.login = login
        this.password = password
        this.name = name
        this.firstName = firstName
        this.tel = tel
        this.mail = mail
        this.lastConDate = lastConDate
        this.createdDay = createdDay
        this.isDelete = isDelete
    }
}
module.exports = UserBean