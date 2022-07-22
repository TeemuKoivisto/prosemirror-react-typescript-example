import { log } from './logger'
import { Request, Response, NextFunction } from 'express'

import { IError } from './error'

import { config } from './config'

export function errorHandler(err: IError, req: Request, res: Response, next: NextFunction): void {
  if (err) {
    const statusCode = err.statusCode ? err.statusCode : 500
    const message = statusCode === 500 ? 'Internal server error.' : 'Something went wrong.'
    const body: { message: string, stack?: string } = { message }
    if (statusCode === 500) {
      log.error('Handled internal server error:')
      log.error(err)
      log.error(err.stack || 'no stacktrace')
    } else {
      log.info('Handled error: ')
      log.info(err)
      log.debug(err.stack || 'no stacktrace')
    }
    if (config.ENV === 'local') {
      body.message = err.message
      body.stack = err.stack
    }
    res.status(statusCode).json(body)
  } else {
    next()
  }
}
