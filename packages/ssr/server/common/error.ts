export interface IError extends Error {
  statusCode?: number
}

export class CustomError extends Error implements IError {
  statusCode: number

  constructor(message: string, errorCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = errorCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends Error implements IError {
  readonly statusCode: number = 400

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DBError extends Error implements IError {
  readonly statusCode: number = 500

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
