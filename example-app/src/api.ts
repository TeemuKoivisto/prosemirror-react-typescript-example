import { stores } from './index'

const {
  REACT_APP_API_URL = 'http://localhost:3400'
} = process.env

export async function get<T>(path: string, defaultError = 'Request failed'): Promise<T> {
  const resp = await fetch(`${REACT_APP_API_URL}/${path}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw Error(data?.message || defaultError)
  }
  return data
}

export async function post<T>(path: string, payload: any, defaultError = 'Request failed'): Promise<T> {
  const resp = await fetch(`${REACT_APP_API_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
    body: JSON.stringify(payload)
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw Error(data?.message || defaultError)
  }
  return data
}

export async function put<T>(path: string, payload: any, defaultError = 'Request failed'): Promise<T> {
  const resp = await fetch(`${REACT_APP_API_URL}/${path}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
    body: JSON.stringify(payload)
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw Error(data?.message || defaultError)
  }
  return data
}

export async function del<T>(path: string, defaultError = 'Request failed'): Promise<T> {
  const resp = await fetch(`${REACT_APP_API_URL}/${path}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `User ${stores.authStore.user?.id}`,
    },
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw Error(data?.message || defaultError)
  }
  return data
}