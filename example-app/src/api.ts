import { stores } from './index'

import { APIError } from '@pm-react-example/shared'

const {
  REACT_APP_API_URL = 'http://localhost:3400'
} = process.env

async function wrappedFetch(path: string, options: RequestInit, defaultError = 'Request failed') {
  let resp
  try {
    resp = await fetch(`${REACT_APP_API_URL}/${path}`, options)
  } catch (err) {
    // Must be a connection error (?)
    throw new APIError('Connection error', 550)
  }
  const data = await resp.json()
  if (!resp.ok) {
    throw new APIError(data?.message || defaultError, resp.status)
  }
  return data
}

export function get<T>(path: string, defaultError?: string): Promise<T> {
  return wrappedFetch(path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
  }, defaultError)
}

export function post<T>(path: string, payload: any, defaultError?: string): Promise<T> {
  return wrappedFetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
    body: JSON.stringify(payload)
  }, defaultError)
}

export function put<T>(path: string, payload: any, defaultError?: string): Promise<T> {
  return wrappedFetch(path, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
    body: JSON.stringify(payload)
  }, defaultError)
}

export function del<T>(path: string, defaultError?: string): Promise<T> {
  return wrappedFetch(path, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
  }, defaultError)
}