import { docDb } from '../../db/doc.db'
import { collabDb } from '../../db/collab.db'

import { IDBDocument, ICreateDocumentParams } from '@pm-react-example/shared'

export const docService = {
  addDocument(params: ICreateDocumentParams, userId: string) {
    const doc = docDb.add(params.title, params.doc)
    // TODO create in collab mode if already enabled
    collabDb.selectDoc(userId, doc.id, false)
    return doc
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
