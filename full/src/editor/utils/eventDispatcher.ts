import { PluginKey } from 'prosemirror-state'

// Source https://bitbucket.org/atlassian/atlaskit-mk-2/src/0fcae893b790443a30f7dadae00638d6e4238b2f/packages/editor/editor-core/src/event-dispatcher/index.ts?at=master

export interface Listeners {
  [name: string]: Listener[]
}
export type Listener<T = any> = (data: T) => void
export type Dispatch<T = any> = (
  eventName: PluginKey | string,
  data: T,
) => void

export class EventDispatcher<T = any> {
  private listeners: Listeners = {}

  on(event: string, cb: Listener<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(cb)
  }

  off(event: string, cb: Listener<T>): void {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event] = this.listeners[event].filter(
      callback => callback !== cb,
    )
  }

  emit(event: string, data: T): void {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event].forEach(cb => cb(data))
  }

  destroy(): void {
    this.listeners = {}
  }
}

/**
 * Creates a dispatch function that can be called inside ProseMirror Plugin
 * to notify listeners about that plugin's state change.
 */
export function createDispatch<T>(
  eventDispatcher: EventDispatcher<T>,
): Dispatch<T> {
  return (eventName: PluginKey | string, data: T) => {
    if (!eventName) {
      throw new Error('event name is required!')
    }

    const event =
      typeof eventName === 'string'
        ? eventName
        : (eventName as PluginKey & { key: string }).key
    eventDispatcher.emit(event, data)
  }
}
