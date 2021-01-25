import React from 'react'
// import { createPortal } from 'react-dom'
import { render, unmountComponentAtNode } from 'react-dom'

export const PORTALS_UPDATE = 'portals-update'

export interface MountedComponent {
  component: React.ReactElement
}
interface Operation {
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  props?: any
}
type Listener<T = any> = (data: T) => void

export class PortalProvider {

  mounted: Map<HTMLElement, MountedComponent> = new Map()
  pendingUpdates: Map<HTMLElement, Operation> = new Map()
  listeners: Map<HTMLElement, Set<Listener>> = new Map()

  render(component: React.ReactElement<any>, container: HTMLElement) {
    this.mounted.set(container, {
      component,
    })
    this.pendingUpdates.set(container, {
      type: 'CREATE'
    })
  }

  update(container: HTMLElement, props: any) {
    this.pendingUpdates.set(container, {
      type: 'UPDATE',
      props,
    })
  }

  remove(container: HTMLElement) {
    this.pendingUpdates.set(container, {
      type: 'DELETE'
    })
  }

  flush() {
    const updated = Array.from(this.pendingUpdates.entries()).map(([container, operation]) => {
      const values = this.mounted.get(container)
      if (!values) return
      const { component } = values
      if (operation.type === 'CREATE') {
        render(component, container)
      } else if (operation.type === 'UPDATE') {
        const set = this.listeners.get(container)
        if (set) {
          set.forEach(cb => cb(operation.props))
        }
      } else if (operation.type === 'DELETE') {
        unmountComponentAtNode(container)
      }
      this.pendingUpdates.delete(container)
      return values
    })
  }

  subscribe(container: HTMLElement, cb: (data: any) => void) {
    const set = this.listeners.get(container) ?? new Set()
    set.add(cb)
    this.listeners.set(container, set)
  }

  unsubscribe(container: HTMLElement, cb: (data: any) => void) {
    const set = this.listeners.get(container)
    if (!set) return
    if (set.has(cb)) {
      set.delete(cb)
    }
    if (set.size === 0) {
      this.listeners.delete(container)
    } else {
      this.listeners.set(container, set)
    }
  }

  destroy() {
    this.listeners = new Map()
    Array.from(this.mounted.entries()).map(([container, values]) => {
      unmountComponentAtNode(container)
    })
    this.mounted = new Map()
    this.pendingUpdates = new Map()
  }
}
