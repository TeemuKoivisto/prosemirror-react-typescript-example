import {
  IGetDocumentResponse, ISaveCollabStepsParams,
} from '@example/types'

const COLLAB_API_URL = 'http://localhost:3400'

export async function sendSteps(payload: ISaveCollabStepsParams) : Promise<{ version: number }> {
  const resp = await fetch(`${COLLAB_API_URL}/doc/1/events`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
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
