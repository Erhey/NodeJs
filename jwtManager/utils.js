
module.exports = {
    /**
     * Cast info to an authentication_account
     * 
     * @param info Info to be casted to authentication_account
     */
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
            if(info.audience) {
                authAccount.audience = info.audience
            }
            if(info.expiresIn) {
                authAccount.expiresIn = info.expiresIn
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