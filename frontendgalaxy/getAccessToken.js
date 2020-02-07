let getAccessTokenForGraphApi = async callback => {
    let postData = {
        login: "KM_GalaxyBreaker",
        password: "LFBa&X8>"
    }
    await $.post("http://localhost:3003/getAccessToken", postData, (data, status) => {
        if(data.token){
            callback(data.token)
        } else {
            console.log(data.message)
        }
    })
}
