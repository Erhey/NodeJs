'use strict';
const moment = require('moment')
class ResponseStatusCode {
    constructor(message, status, detail) {
        if (new.target === ResponseStatusCode) {
            throw new TypeError('Abstract class "ResponseStatusCode" cannot be instantiated directly.');
        }
        this.name = this.constructor.name;
        this.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        this.message = message
        this.status = status
        this.detail = detail
    }
}
class Success extends ResponseStatusCode {
    constructor(detail='') {
        super('The request has succeeded.', 200, detail)
    }
}
class SuccessPost extends ResponseStatusCode {
    constructor(detail='') {
        super('The request has succeeded and a new resource has been created/modified.', 201, detail)
    }
}
class NoContent extends ResponseStatusCode {
    constructor(detail='') {
        super('No content found.', 204, detail)
    }
}
class BadRequest extends ResponseStatusCode {
    constructor(detail='') {
        super('400 The server could not understand the request due to invalid syntax.', 400, detail)
    }
}
class Unauthorized extends ResponseStatusCode {
    constructor(detail='') {
        super('401 Authentication is required to access the current ressource', 401, detail)
    }
}
class Forbidden extends ResponseStatusCode {
    constructor(detail='') {
        super('403 You are not authorized to access the current ressource', 403, detail)
    }
}
class NotFound extends ResponseStatusCode {
    constructor(detail='') {
        super('404 Page Not Found : The server could not find requested resource.', 404, detail)
    }
}
class ProxyRequired extends ResponseStatusCode {
    constructor(detail='') {
        super('407 Proxy authentication required', 407, detail)
    }
}
class RequestTimeout extends ResponseStatusCode {
    constructor(detail='') {
        super('408 The request timed out.', 408, detail)
    }
}
class Gone extends ResponseStatusCode {
    constructor(detail='') {
        super('410 The request is no more available.', 410, detail)
    }
}
class UnsupportedContentType extends ResponseStatusCode {
    constructor(detail='') {
        super('415 The content format is not supported by the server for the current request.', 415, detail)
    }
}
class InternalServerError extends ResponseStatusCode {
    constructor(detail='') {
        super('500 Server Error: Unexpected internal server error occured.', 500, detail)
    }
}
class NotImplemented extends ResponseStatusCode {
    constructor(detail='') {
        super('501 Server Error: The request method is not supported by the server and cannot be handled.', 501, detail)
    }
}
class BadGateway extends ResponseStatusCode {
    constructor(detail='') {
        super('502 Server Error: The server encountered a temporary error and could not complete your request', 502, detail)
    }
}
class ServiceUnavailable extends ResponseStatusCode {
    constructor(detail='') {
        super('503 Server Error: The request has succeeded.', 503, detail)
    }
}
class GatewayTimeout extends ResponseStatusCode {
    constructor(detail='') {
        super('504 Server Error: The request has succeeded.', 504, detail)
    }
}

module.exports.StatusError_200 =  Success                   // For all normal response
module.exports.StatusError_201 =  SuccessPost               // For all post/put response
module.exports.StatusError_204 =  NoContent                 // For response with no body
module.exports.StatusError_400 =  BadRequest                // For Not recievable client request (parameters not enough to execute the request. Parameters not in a good format, etc...)
module.exports.StatusError_401 =  Unauthorized              // Need authentication to access (no token/passport)
module.exports.StatusError_403 =  Forbidden                 // Need correct authentication to access
module.exports.StatusError_404 =  NotFound                  // Bad routing : The page does not exist
module.exports.StatusError_407 =  ProxyRequired             // Proxy authentication required to access the ressource
module.exports.StatusError_408 =  RequestTimeout            // Too long to respond => time out
module.exports.StatusError_410 =  Gone                      // Previously exists but got deleted/moved
module.exports.StatusError_415 =  UnsupportedContentType    // Close to bad request. For exemple need a mp3 but got a wav to process
module.exports.StatusError_500 =  InternalServerError       // Unexpected error from server
module.exports.StatusError_501 =  NotImplemented            // for get only
module.exports.StatusError_502 =  BadGateway                // Error while creating response as a gate way   =>         client -> Server1 -> gateway -> Server2 -> Error 502 (Error on server 2)
module.exports.StatusError_503 =  ServiceUnavailable        // Service down
module.exports.StatusError_504 =  GatewayTimeout            // Error time out response          =>     client -> Server1 -> gateway -> Server2 -> Error 504 (Server2 response takes to long... ) 

