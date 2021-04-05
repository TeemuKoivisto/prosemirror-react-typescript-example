import { Request, Response, NextFunction } from 'express'
import { ParsedQs } from 'qs'

import { docCollabService } from './doc-collab.svc'
import { socketIO } from '../../socket-io/socketIO'
import { CustomError } from '../../common/error'
import { collabDb } from '../../db/collab.db'

import { IRequest } from '../../types/request'
import {
  ISaveCollabStepsParams
} from '@pm-react-example/shared'

// function parseQueryParam(param: undefined | string | string[] | ParsedQs | ParsedQs[]) : string {
//   if (typeof param === 'object') {
//     throw new CustomError(`Object as query param: ${param}`, 400)
//   } else if (param === null || param === undefined) {
//     throw new CustomError(`Null or undefined query param: ${param}`, 400)
//   }
//   return param
// }

export const clientJoin = async (
  req: IRequest<{}, {}, { documentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentId } = req.params
    const userId = req.headers['authorization'].split(' ').pop()
    if (!collabDb.canUserEdit(userId, documentId)) {
      return next(new CustomError('Document is in-use by another user', 403))
    }
    const instance = docCollabService.getInstance(documentId)
    instance.handleUserJoin(userId)
    const data = instance.currentDocument
    socketIO.emitCollabUsersChanged(userId, data.userCount, documentId)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const clientLeave = async (
  req: IRequest<{}, {}, { documentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentId } = req.params
    const userId = req.headers['authorization'].split(' ').pop()
    if (!collabDb.canUserEdit(userId, documentId)) {
      return res.json(false)
    }
    const instance = docCollabService.getInstance(documentId)
    instance.handleUserLeave(userId)
    socketIO.emitCollabUsersChanged(userId, instance.currentDocument.userCount, documentId)
    res.json(true)
  } catch (err) {
    next(err)
  }
}

// export const getDocumentEvents = async (
//   req: IRequest<{}, { version: number }, { documentId: string }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const version = parseInt(parseQueryParam(req.query.version))
//     const instance = docEventService.getInstance(req.params.documentId)
//     const data = instance.getEvents(version)
//     if (!data) {
//       return next(new CustomError('History no longer available', 410))
//     }
//     res.json(createNewStepsResponse(instance, data))
//   } catch (err) {
//     next(err)
//   }
// }

export const saveSteps  = async (
  req: IRequest<ISaveCollabStepsParams, {}, { documentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentId } = req.params
    const userId = req.headers['authorization'].split(' ').pop()
    if (!collabDb.canUserEdit(userId, documentId)) {
      return next(new CustomError('Document has been made private by another user', 403))
    }
    const { version, steps, clientID } = req.body
    const parsedSteps = docCollabService.parseSteps(steps)
    const instance = docCollabService.getInstance(documentId)
    const result = instance.handleReceiveSteps(version, parsedSteps, clientID)
    if (!result) {
      return next(new CustomError('Version not current', 409))
    }
    socketIO.emitEditDocument(result.version, result.steps)
    res.json(result)
  } catch (err) {
    next(err)
  }
}