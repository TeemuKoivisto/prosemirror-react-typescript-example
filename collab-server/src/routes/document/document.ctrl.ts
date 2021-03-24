import { Response, NextFunction } from 'express'

import { docService } from './document.svc'

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
    const result: IDBDocument = docService.addDocument(req.body)
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
    docService.updateDocument(req.params.documentId, req.body)
    res.json()
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
    docService.deleteDocument(req.params.documentId)
    res.json()
  } catch (err) {
    next(err)
  }
}
