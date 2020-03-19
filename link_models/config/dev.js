module.exports = {
	wamp:{
		name: 'wamp'
		,description: 'Storing user data on wamp Mysql server'
		,type: 'mysql'
		,host: 'localhost'
		,database: 'crud_mysql'
		,user: 'root'
		,password: ''
	},
	galaxy_breaker: {
		name: 'galaxy_breaker'
		,description: 'Storing data for galaxy breaker'
		,type: 'mongodb'
		,host: '127.0.0.1'
		,database: 'galaxy_breaker'
	},
	tracking: {
		name: 'tracking'
		,description: 'Storing tracking data of CRUD-MYSQL on mongodb server'
		,type: 'mongodb'
		,host: '127.0.0.1'
		,database: 'CRUD-MYSQL'
	},
	jwt: {
		name: 'jwt'
		,description: 'Storing user account information on mongodb server to get the right to access to multiple api using jwt/rsa/salted-bcrypt system.'
		,type: 'mongodb'
		,host: '127.0.0.1'
		,database: 'authentication'
	},
	redis: {
		redisUrl: 'redis://127.0.0.1:6379',
		expTime: '60000'

	},
	mock :{}
}
