import { IDBDocument, IGetDocumentsResponse, ICreateDocumentParams } from '@pm-react-example/shared'

import { stores } from './index'

const {
  REACT_APP_API_URL = 'http://localhost:3400'
} = process.env

export async function getDocuments() : Promise<IGetDocumentsResponse> {
  const resp = await fetch(`${REACT_APP_API_URL}/docs`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return await resp.json()
}

export async function createDocument(data: ICreateDocumentParams) : Promise<IDBDocument> {
  const resp = await fetch(`${REACT_APP_API_URL}/doc`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return await resp.json()
}

export async function updateDocument(docId: string, data: Partial<IDBDocument>) : Promise<void> {
  const resp = await fetch(`${REACT_APP_API_URL}/doc/${docId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return await resp.json()
}

export async function deleteDocument(docId: string) : Promise<void> {
  const resp = await fetch(`${REACT_APP_API_URL}/doc/${docId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
  })
  return await resp.json()
}