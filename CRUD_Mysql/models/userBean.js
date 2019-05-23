export class User {
    constructor(id, login, password, name, firstName, tel, mail, lastConDate, createdDay, isDelete) {
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
        console.log("User created !")
    }
}