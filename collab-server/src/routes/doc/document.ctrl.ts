import { Response, NextFunction } from 'express'

import { docService } from './document.svc'
import { docCollabService } from '../doc_collab/doc-collab.svc'
import { CustomError } from 'src/common/error'
import { socketIO } from '../../socket-io/socketIO'

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
    const userId = req.headers['authorization'].split(' ').pop()
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
    const userId = req.headers['authorization'].split(' ').pop()
    const dbDoc = docService.getDocument(req.params.documentId, userId)
    if (!dbDoc) {
      return next(new CustomError('Not authorized to access the document', 403))
    }
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
    const { documentId } = req.params
    const result = docService.updateDocument(documentId, req.body, userId)
    if (!result) {
      return next(new CustomError('Not authorized to update the document', 403))
    }
    docCollabService.evictInstance(documentId)
    // TODO check if visible changed ->
    // socketIO.emitDocVisibilityChanged(documentId, userId)
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
      return next(new CustomError('Not authorized to delete the document', 403))
    }
    docCollabService.evictInstance(documentId)
    socketIO.emitDocDeleted(documentId, userId)
    res.json(true)
  } catch (err) {
    next(err)
  }
}
