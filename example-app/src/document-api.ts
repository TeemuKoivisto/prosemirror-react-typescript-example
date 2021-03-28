import { IDBDocument, IGetDocumentsResponse, ICreateDocumentParams } from '@pm-react-example/shared'

import { get, post, put, del } from './api'

export const getDocuments = () =>
  get<IGetDocumentsResponse>('docs', 'Fetching documents failed')

export const createDocument = (payload: ICreateDocumentParams) =>
  post<IDBDocument>('doc', payload, 'Document create failed')

export const updateDocument = (docId: string, payload: Partial<IDBDocument>) =>
  put<boolean>(`doc/${docId}`, payload, 'Document update failed')

export const deleteDocument = (docId: string) =>
  del<boolean>(`doc/${docId}`, 'Document delete failed')
