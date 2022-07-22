// import * as Joi from '@hapi/joi'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export interface IRequest<T = {}, P = {}, U extends ParamsDictionary = {}> extends Request<U> {
  body: T
  queryParams: P
}
