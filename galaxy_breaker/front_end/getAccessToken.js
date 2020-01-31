let getAccessTokenForGraphApi = async callback => {
    let postData = {
        login: "KM_graph",
        password: "8+N56?K>"
    }
    await $.post("http://localhost:3003/getAccessToken", postData, (data, status) => {
        if(data.token){
            callback(data.token)
        } else {
            console.log(data.message)
        }
    })
}