'use strict';

class RequestStatusError {
    constructor(message, status) {
        if (new.target === RequestStatusError) {
            throw new TypeError('Abstract class "RequestStatusError" cannot be instantiated directly.');
        }
        this.name = this.constructor.name;
        this.statusMessage = message;
        this.status = status;
        console.log(status)
    }
}
class Continue extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 100)
    }
}
class SwitchingProtocols extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 101)
    }
}
class EarlyHints extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 103)
    }
}
class OK extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 200)
    }
}
class Created extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 201)
    }
}
class Accepted extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 202)
    }
}
class NonAuthoritativeInformation extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 203)
    }
}
class NoContent extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 204)
    }
}
class ResetContent extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 205)
    }
}
class PartialContent extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 206)
    }
}
class MultipleChoices extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 300)
    }
}
class MovedPermanently extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 301)
    }
}
class Found extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 302)
    }
}
class SeeOther extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 303)
    }
}
class NotModified extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 304)
    }
}
class TemporaryRedirect extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 307)
    }
}
class PermanentRedirect extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 308)
    }
}
class BadRequest extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 400)
    }
}
class Unauthorized extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 401)
    }
}
class PaymentRequired extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 402)
    }
}
class Forbidden extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 403)
    }
}
class NotFound extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 404)
    }
}
class MethodNotAllowed extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 405)
    }
}
class NotAcceptable extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 406)
    }
}
class ProxyAuthenticationRequired extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 407)
    }
}
class RequestTimeout extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 408)
    }
}
class Conflict extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 409)
    }
}
class Gone extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 410)
    }
}
class LengthRequired extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 411)
    }
}
class PreconditionFailed extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 412)
    }
}
class PayloadTooLarge extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 413)
    }
}
class URITooLong extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 414)
    }
}
class UnsupportedMediaType extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 415)
    }
}
class RangeNotSatisfiable extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 416)
    }
}
class ExpectationFailed extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 417)
    }
}
class ImATeapot extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 418)
    }
}
class UnprocessableEntity extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 422)
    }
}
class TooEarly extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 425)
    }
}
class UpgradeRequired extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 426)
    }
}
class PreconditionRequired extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 428)
    }
}
class TooManyRequests extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 429)
    }
}
class RequestHeaderFieldsTooLarge extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 431)
    }
}
class UnavailableForLegalReasons extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 451)
    }
}
class InternalServerError extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 500)
    }
}
class NotImplemented extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 501)
    }
}
class BadGateway extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 502)
    }
}
class ServiceUnavailable extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 503)
    }
}
class GatewayTimeout extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 504)
    }
}
class HTTPVersionNotSupported extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 505)
    }
}
class NetworkAuthenticationRequired extends RequestStatusError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m, 511)
    }
}


module.exports.StatusError_100 = Continue
module.exports.StatusError_101 = SwitchingProtocols
module.exports.StatusError_103 = EarlyHints
module.exports.StatusError_200 = OK
module.exports.StatusError_201 = Created
module.exports.StatusError_202 = Accepted
module.exports.StatusError_203 = NonAuthoritativeInformation
module.exports.StatusError_204 = NoContent
module.exports.StatusError_205 = ResetContent
module.exports.StatusError_206 = PartialContent
module.exports.StatusError_300 = MultipleChoices
module.exports.StatusError_301 = MovedPermanently
module.exports.StatusError_302 = Found
module.exports.StatusError_303 = SeeOther
module.exports.StatusError_304 = NotModified
module.exports.StatusError_307 = TemporaryRedirect
module.exports.StatusError_308 = PermanentRedirect
module.exports.StatusError_400 = BadRequest
module.exports.StatusError_401 = Unauthorized
module.exports.StatusError_402 = PaymentRequired
module.exports.StatusError_403 = Forbidden
module.exports.StatusError_404 = NotFound
module.exports.StatusError_405 = MethodNotAllowed
module.exports.StatusError_406 = NotAcceptable
module.exports.StatusError_407 = ProxyAuthenticationRequired
module.exports.StatusError_408 = RequestTimeout
module.exports.StatusError_409 = Conflict
module.exports.StatusError_410 = Gone
module.exports.StatusError_411 = LengthRequired
module.exports.StatusError_412 = PreconditionFailed
module.exports.StatusError_413 = PayloadTooLarge
module.exports.StatusError_414 = URITooLong
module.exports.StatusError_415 = UnsupportedMediaType
module.exports.StatusError_416 = RangeNotSatisfiable
module.exports.StatusError_417 = ExpectationFailed
module.exports.StatusError_418 = ImATeapot
module.exports.StatusError_422 = UnprocessableEntity
module.exports.StatusError_425 = TooEarly
module.exports.StatusError_426 = UpgradeRequired
module.exports.StatusError_428 = PreconditionRequired
module.exports.StatusError_429 = TooManyRequests
module.exports.StatusError_431 = RequestHeaderFieldsTooLarge
module.exports.StatusError_451 = UnavailableForLegalReasons
module.exports.StatusError_500 = InternalServerError
module.exports.StatusError_501 = NotImplemented
module.exports.StatusError_502 = BadGateway
module.exports.StatusError_503 = ServiceUnavailable
module.exports.StatusError_504 = GatewayTimeout
module.exports.StatusError_505 = HTTPVersionNotSupported
module.exports.StatusError_511 = NetworkAuthenticationRequired