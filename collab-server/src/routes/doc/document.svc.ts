import { docDb } from '../../db/doc.db'
import { collabDb } from '../../db/collab.db'


import { IDBDocument, ICreateDocumentParams } from '@pm-react-example/shared'

export const docService = {
  addDocument(params: ICreateDocumentParams, userId: string) {
    const doc = docDb.add(params.title, params.doc)
    collabDb.lockDoc(userId, doc.id)
    return doc
  },
  getDocument(id: string) {
    return docDb.get(id)
  },
  getDocuments() {
    return docDb.getAll()
  },
  updateDocument(id: string, data: Partial<IDBDocument>, userId: string) {
    if (collabDb.isLocked(userId, id)) {
      return false
    }
    docDb.update(id, data)
    return true
  },
  deleteDocument(id: string, userId: string) {
    if (collabDb.isLocked(userId, id)) {
      return false
    }
    docDb.delete(id)
    return true
  }
}
