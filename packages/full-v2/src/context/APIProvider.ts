import { Socket } from 'socket.io-client'
import { EditorSocketAction, EditorSocketActionType } from '@example/types'

interface APIProps {
  API_URL: string
  getAuthorization?: () => string
  socket: Socket | null
}

export class APIProvider {
  API_URL = ''
  socket: Socket | null = null

  getAuthorization: () => string = () => ''

  init(props?: APIProps) {
    this.API_URL = props?.API_URL ?? ''
    this.socket = props?.socket ?? null
    this.getAuthorization = props?.getAuthorization ?? (() => '')
  }

  async wrappedFetch(path: string, options: RequestInit, defaultError = 'Request failed') {
    let resp
    try {
      resp = await fetch(`${this.API_URL}/${path}`, options)
    } catch (err) {
      // Must be a connection error (?)
      // throw new APIError('Connection error', 550)
      console.error(err)
      return
    }
    const data = await resp.json()
    if (!resp.ok) {
      // throw new APIError(data?.message || defaultError, resp.status)
      console.error(data?.message || defaultError)
      return
    }
    return data
  }

  get<T>(path: string, defaultError?: string): Promise<T> {
    return this.wrappedFetch(
      path,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
        },
      },
      defaultError
    )
  }

  post<T>(path: string, payload: any, defaultError?: string): Promise<T> {
    return this.wrappedFetch(
      path,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
        },
        body: JSON.stringify(payload),
      },
      defaultError
    )
  }

  put<T>(path: string, payload: any, defaultError?: string): Promise<T> {
    return this.wrappedFetch(
      path,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
        },
        body: JSON.stringify(payload),
      },
      defaultError
    )
  }

  del<T>(path: string, defaultError?: string): Promise<T> {
    return this.wrappedFetch(
      path,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
        },
      },
      defaultError
    )
  }

  emit<T>(path: string, action: EditorSocketAction) {
    if (!this.socket) throw Error('APIProvider: trying to emit with empty socket')
    return new Promise((resolve, reject) => {
      this.socket?.emit(action.type, action, function (err: string, data: T) {
        console.log('err', err)
        console.log('received data', data)
        resolve(data)
      })
    })
  }

  on<T>(actionType: EditorSocketActionType, fn: (data: T) => void) {
    if (!this.socket) throw Error('APIProvider: trying to subscribe to empty socket')
    this.socket?.on(actionType, fn)
  }

  off<T = undefined>(actionType: EditorSocketActionType, fn: (data: T) => void) {
    if (!this.socket) throw Error('APIProvider: trying to unsubscribe from empty socket')
    this.socket?.off(actionType, fn)
  }
}
