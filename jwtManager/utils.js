
module.exports = {
    createAuthAccountObj : info => {
        let authAccount = {}
        if(info){
            if(info.name) {
                authAccount.name = info.name
            }
            if(info.login) {
                authAccount.login = info.login
            }
            if(info.password) {
                authAccount.password = info.password
            }
            if(info.createdAt) {
                authAccount.createdAt = info.createdAt
            }
            if(info.updatedAt) {
                authAccount.updatedAt = info.updatedAt
            }
            return authAccount
        }
    }
}