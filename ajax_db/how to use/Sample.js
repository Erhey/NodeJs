// Get token Sample 
let getAccessTokenMongoJWT = async callback => {
    await $.post('http://localhost:3003/getAccessToken', { login: 'login', password: '*********' }, data => {
        if (data.token) {
            callback(data.token)
        } else {
            // handle error
        }
    })
}

/************************************************* AJAX MONGO DB SERVER *************************************************/

/**
 * Find/FindOne
 */
await $.ajax({
    url: 'http://localhost:3002/jwt',
    headers: {
        'Authorization': 'Bearer ' + access_tokenMongoJWT,
        'contentType': 'application/json'
    },
    data: {
        'configName': 'jwt'
        , 'queryType': 'find'
        , 'collection': 'authentication'
        , 'queryContent': {}
    },
    datatype: 'json',
    method: 'post',
    success: (result) => {
        // Action
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // action
    }
})


/**
 * replaceOne
 */
$.ajax({
    url: 'http://localhost:3002/jwt',
    headers: {
        'Authorization': 'Bearer ' + access_tokenMongoJWT,
        'contentType': 'application/json'
    },
    data: {
        configName: 'jwt'
        , queryType: 'replaceOne'
        , collection: 'authentication'
        , queryContent: {
            filter: {
                _id: '5d6f6f2c3cd8e04ee4000000'
            },
            record: {
                login: 'mock4'
                , password: '2uWL845@#'
                , name: 'access_c5rw'
                , action: 'r/rw'
                , expiresIn: '1d'
                , audience: 'mock'
                , server: 'localhost:3002'
                , createdAt: '2019-09-04 16:39:52.366'
                , updatedAt: '2019-09-04 16:39:52.366'
            }
        }
    },
    datatype: 'json',
    method: 'post',
    success: (result) => {
        // Action
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // action
    }
})
/**
 * InsertOne/Many
 */
await $.ajax({
    url: 'http://localhost:3002/jwt',
    headers: {
        'Authorization': 'Bearer ' + access_tokenMongoJWT,
        'contentType': 'application/json'
    },
    data: {
        configName: 'jwt'
        , queryType: 'insertOne'
        , collection: 'authentication'
        , queryContent: {
            login: 'mock2'
            , password: '2uWL845@#'
            , name: 'access_c5rw'
            , action: 'r/rw'
            , expiresIn: '1d'
            , audience: 'mock'
            , server: 'localhost:3002'
            , createdAt: '2019-09-04 16:39:52.366'
            , updatedAt: '2019-09-04 16:39:52.366'
        }
    },
    datatype: 'json',
    method: 'post',
    success: (result) => {
        // Action
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // action
    }
})

/**
 * updateMany
 */
await $.ajax({
    url: 'http://localhost:3002/jwt',
    headers: {
        'Authorization': 'Bearer ' + access_tokenMongoJWT,
        'contentType': 'application/json'
    },
    data: {
        configName: 'jwt'
        , queryType: 'updateMany'
        , collection: 'authentication'
        , queryContent: {
            filter: {
                _id: '5d6f6f2c3cd8e04ee4000000'
            },
            $set: {
                login: 'mock5'
            }
        }
    },
    datatype: 'json',
    method: 'post',
    success: (result) => {
        // Action
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // action
    }
})







/************************************************* AJAX MYSQL DB SERVER *************************************************/


/**
 * What ever you request it reponds!
 */
await $.ajax({
    url: 'http://localhost:3002/wamp',
    headers: {
        'Authorization': 'Bearer ' + access_tokenMysqlCrud,
        'contentType': 'application/json'
    },
    data: JSON.stringify({
        'configName': 'wamp',
        'sql': `Select * from User WHERE uuid IN (${uuids_str}) AND firstname LIKE '%'`
    }),
    datatype: 'json',
    method: 'POST',
    success: (result) => {
        // Action
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // action
    }
})
