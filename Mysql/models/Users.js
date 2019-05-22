class Users {
	constructor(login, password, Name, FirstName, tel, mail, lastConDate, createdDay, isDelete, id){
		this.login = login
		this.password = password
		this.Name = Name
		this.FirstName = FirstName
		this.tel = tel
		this.mail = mail
		this.lastConDate = lastConDate
		this.createdDay = createdDay
		this.isDelete = isDelete
		this.id = id
	}
}
module.exports = Users;
