import { docDb } from '../../db/doc.db'
import { collabDb } from '../../db/collab.db'

import { IDBDocument, ICreateDocumentParams } from '@pm-react-example/shared'

export const docService = {
  addDocument(params: ICreateDocumentParams, userId: string) {
    const { title, doc, collab } = params
    const dbDoc = docDb.add(title, doc, collab)
    // TODO create in collab mode if already enabled
    collabDb.selectDoc(userId, dbDoc.id, false)
    return dbDoc
  },
  getDocument(id: string) {
    return docDb.get(id)
  },
  getDocuments() {
    return docDb.getAll()
  },
  updateDocument(documentId: string, data: Partial<IDBDocument>, userId: string) {
    if (!collabDb.canUserEdit(userId, documentId)) {
      return false
    }
    docDb.update(documentId, data)
    return true
  },
  deleteDocument(documentId: string, userId: string) {
    if (!collabDb.canUserEdit(userId, documentId)) {
      return false
    }
    docDb.delete(documentId)
    return true
  }
}
