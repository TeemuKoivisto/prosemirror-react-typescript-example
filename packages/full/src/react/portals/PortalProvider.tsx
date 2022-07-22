import React from 'react'
import { createPortal } from 'react-dom'

type Listener<T = any> = (data: T) => void

export class PortalProvider {

  shouldUpdatePortals: boolean = true
  portals: Map<HTMLElement, React.ReactPortal> = new Map()
  pendingUpdatedProps: Map<HTMLElement, any> = new Map()
  nodeViewListeners: Map<HTMLElement, Set<Listener>> = new Map()
  portalRendererCallback?: (newPortals: Map<HTMLElement, React.ReactPortal>) => void

  render(component: React.ReactElement<any>, container: HTMLElement) {
    this.portals.set(container, createPortal(component, container))
    this.shouldUpdatePortals = true
  }

  update(container: HTMLElement, props: any) {
    this.pendingUpdatedProps.set(container, props)
  }

  remove(container: HTMLElement) {
    this.portals.delete(container)
    this.shouldUpdatePortals = true
  }

  flush() {
    Array.from(this.pendingUpdatedProps.entries()).map(([container, props]) => {
      const set = this.nodeViewListeners.get(container)
      if (set) {
        set.forEach(cb => cb(props))
      }
      this.pendingUpdatedProps.delete(container)
    })
    if (this.portalRendererCallback && this.shouldUpdatePortals) {
      this.portalRendererCallback!(this.portals)
      this.shouldUpdatePortals = false
    }
  }

  subscribe(container: HTMLElement, cb: (data: any) => void) {
    const set = this.nodeViewListeners.get(container) ?? new Set()
    set.add(cb)
    this.nodeViewListeners.set(container, set)
  }

  unsubscribe(container: HTMLElement, cb: (data: any) => void) {
    const set = this.nodeViewListeners.get(container)
    if (!set) return
    if (set.has(cb)) {
      set.delete(cb)
    }
    if (set.size === 0) {
      this.nodeViewListeners.delete(container)
    } else {
      this.nodeViewListeners.set(container, set)
    }
  }

  addPortalRendererCallback(cb: (newPortals: Map<HTMLElement, React.ReactPortal>) => void) {
    this.portalRendererCallback = cb
    // Render the portals immediately
    cb(this.portals)
  }
}
