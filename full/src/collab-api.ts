import { Step } from 'prosemirror-transform'
import { Transaction } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'

const COLLAB_API_URL = 'http://localhost:3400'

interface Sendable {
  version: number
  steps: Step[]
  clientID: number | string
  origins: Transaction[]
}

export interface IGetDocumentResponse {
  doc: PMNode
  userCount: number
  version: number
}
export interface IEventsResponse {
  version: number
  steps: Step[]
  clientIDs: number[]
  usersCount: number
}

export async function sendSteps(sendable: Sendable) : Promise<{ version: number }> {
  const resp = await fetch(`${COLLAB_API_URL}/doc/1/events`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendable)
  })
  return resp.json()
}

export async function getDocument() : Promise<IGetDocumentResponse> {
  const resp = await fetch(`${COLLAB_API_URL}/doc/1`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return resp.json()
}

export async function fetchEvents(version: number) {
  return fetch(`${COLLAB_API_URL}/doc/1/events?version=${version}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
}
