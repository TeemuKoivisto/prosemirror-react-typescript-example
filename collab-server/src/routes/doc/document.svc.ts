import { db } from '../../DB'

import { IDBDocument, ICreateDocumentParams } from '@pm-react-example/shared'

export const docService = {
  addDocument(params: ICreateDocumentParams) {
    return db.add(params.title, params.doc)
  },
  getDocument(id: string) {
    return db.get(id)
  },
  getDocuments() {
    return db.getAll()
  },
  updateDocument(id: string, data: Partial<IDBDocument>) {
    return db.update(id, data)
  },
  deleteDocument(id: string) {
    return db.delete(id)
  }
}
