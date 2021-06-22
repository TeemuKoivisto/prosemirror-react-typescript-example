module.exports.uuidv4 = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
class CustomError extends Error {
  constructor(message, errorCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = errorCode
    // Doesn't exist in FF
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor)
  }
}
module.exports.APIError = CustomError