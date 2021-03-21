import { Step } from 'prosemirror-transform'
import { Transaction } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'

import { IDBDocument } from './types/document'

const {
  REACT_APP_API_URL = 'http://localhost:3400'
} = process.env

interface Sendable {
  version: number
  steps: Step[]
  clientID: number | string
  origins: Transaction[]
}

export interface IGetDocumentsResponse {
  docs: IDBDocument[]
}
export interface IEventsResponse {
  version: number
  steps: Step[]
  clientIDs: number[]
  usersCount: number
}

export async function getDocuments() : Promise<IGetDocumentsResponse> {
  const resp = await fetch(`${REACT_APP_API_URL}/docs`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return resp.json()
}
