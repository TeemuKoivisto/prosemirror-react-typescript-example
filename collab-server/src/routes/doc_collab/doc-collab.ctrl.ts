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
      return next(new CustomError('Not allowed to edit the document', 403))
    }
    collabDb.startEditing(userId, documentId)
    const instance = docCollabService.getInstance(documentId, userId)
    instance.handleUserJoin(userId)
    const data = instance.currentDocument
    socketIO.addUserToDocumentRoom(userId, documentId)
    socketIO.emitCollabUsersChanged(documentId, userId, data.userCount)
    // Can't return the data here since the socket already sends the changes to all the clients, including sender
    // The emitting logic would otherwise have to be modified to send to all except user
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
    collabDb.leaveDocument(userId, documentId)
    const instance = docCollabService.getInstance(documentId, userId)
    instance.handleUserLeave(userId)
    socketIO.removeUserFromDocumentRoom(userId, documentId)
    socketIO.emitCollabUsersChanged(documentId, userId, instance.currentDocument.userCount)
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
    const instance = docCollabService.getInstance(documentId, userId)
    const result = instance.handleReceiveSteps(version, parsedSteps, clientID)
    if (!result) {
      // TODO maybe, JUST MAYBE, return the necessary data to inform client how to sync back up
      // Maybe steps between the current version vs client version
      return next(new CustomError('Version not current', 409))
    }
    docCollabService.appendToHistory(documentId, result.steps, result.version)
    docCollabService.saveInstance(instance)
    const payload = {
      steps: result.steps.map(s => s.toJSON()), // Interesting fact: clientID is discarded when toJSON'd
      version: result.version,
      clientIDs: result.steps.map(() => clientID) // The clientID doesn't change for any of the steps so this is a bit silly
    }
    socketIO.emitEditDocument(documentId, payload)
    res.json(payload)
  } catch (err) {
    next(err)
  }
}
