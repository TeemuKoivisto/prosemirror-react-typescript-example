import { Response, NextFunction } from 'express'

import { docService } from './document.svc'
import { docCollabService } from 'pm/collab.svc'
import { documentIO } from './document.io'
import { CustomError } from 'common/error'

import { IRequest } from 'types/request'
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
    documentIO.emitDocCreated(result, userId)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

// TODO update doc only through steps, not with regular PUT
// maybe as a backup one can send the whole doc eg due to network error/server goes down
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
    // If the doc was changed, wipe out the history and collab instance
    if (req.body.doc) {
      docCollabService.evictInstance(documentId)
    }
    // TODO compare to previous visibility to decide whether to terminate collab or
    // ping users that a document has been made global
    if (req.body.visibility) {
      documentIO.emitVisibilityChanged(documentId, req.body.visibility, userId)
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
      return next(new CustomError('Not authorized to delete the document', 403))
    }
    docCollabService.evictInstance(documentId)
    documentIO.emitDocDeleted(documentId, userId)
    res.json(true)
  } catch (err) {
    next(err)
  }
}
