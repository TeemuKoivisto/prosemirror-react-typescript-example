import { Response, NextFunction } from 'express'

import { docService } from './document.svc'
import { CustomError } from 'src/common/error'
import { socketIO } from '../../socketIO'

import { IRequest } from '../../types/request'
import {
  ICreateDocumentParams, IGetDocumentsResponse, IDBDocument
} from '@pm-react-example/shared'

export const getDocuments = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = docService.getDocuments()
    const result: IGetDocumentsResponse = { docs }
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getDocument = async (
  req: IRequest<{}, {}, { documentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const dbDoc = docService.getDocument(req.params.documentId)
    res.json(dbDoc)
  } catch (err) {
    next(err)
  }
}

export const createDocument = async (
  req: IRequest<ICreateDocumentParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['authorization'].split(' ').pop()
    const result: IDBDocument = docService.addDocument(req.body, userId)
    socketIO.emitDocCreated(result, userId)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const updateDocument = async (
  req: IRequest<Partial<IDBDocument>, {}, { documentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['authorization'].split(' ').pop()
    const result = docService.updateDocument(req.params.documentId, req.body, userId)
    if (!result) {
      return next(new CustomError('Document is in-use by another user', 403))
    }
    res.json(true)
  } catch (err) {
    next(err)
  }
}

export const deleteDocument = async (
  req: IRequest<{}, {}, { documentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['authorization'].split(' ').pop()
    const { documentId } = req.params
    const result = docService.deleteDocument(documentId, userId)
    if (!result) {
      return next(new CustomError('Document is in-use by another user', 403))
    }
    socketIO.emitDocDeleted(documentId, userId)
    res.json(true)
  } catch (err) {
    next(err)
  }
}
