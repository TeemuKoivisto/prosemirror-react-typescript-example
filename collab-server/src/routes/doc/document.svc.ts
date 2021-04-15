import { docDb } from '../../db/doc.db'
import { collabDb } from '../../db/collab.db'

import { IDBDocument, ICreateDocumentParams } from '@pm-react-example/shared'

export const docService = {
  addDocument(params: ICreateDocumentParams, userId: string) {
    const { title, doc, visibility } = params
    const dbDoc = docDb.add(title, doc, userId, visibility)
    // TODO create in collab mode if already enabled
    collabDb.startEditing(userId, dbDoc.id, visibility)
    return dbDoc
  },
  getDocument(id: string, userId: string) {
    const doc = docDb.get(id)
    if (doc && doc.userId === userId) {
      return doc
    }
    return false
  },
  getDocuments() {
    return docDb.getAll()
  },
  updateDocument(documentId: string, data: Partial<IDBDocument>, userId: string) {
    if (!collabDb.isUserOwner(userId, documentId)) {
      return false
    }
    docDb.update(documentId, data)
    return true
  },
  deleteDocument(documentId: string, userId: string) {
    if (!collabDb.isUserOwner(userId, documentId)) {
      return false
    }
    docDb.delete(documentId)
    return true
  }
}
