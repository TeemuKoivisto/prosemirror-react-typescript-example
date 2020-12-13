import React from 'react'
import { createPortal } from 'react-dom'
import { EventDispatcher } from '../../core/utils/EventDispatcher'

export const PORTALS_UPDATE = 'portals-update', PORTALS_DELETE = 'portals-delete'

export interface MountedPortal {
  container: HTMLElement
  portal: React.ReactPortal
}

export class PortalProvider {

  portals: Map<HTMLElement, React.ReactPortal> = new Map()
  dispatcher: EventDispatcher = new EventDispatcher()

  render(component: React.ReactElement, container: HTMLElement) {
    // Do _not_ update portals incase the element has already been rendered with createPortal
    if (this.portals.has(container)) {
      return
    }
    const portal = createPortal(component, container)
    this.portals.set(container, portal)
    this.dispatcher.emit(PORTALS_UPDATE, { portal, container })
  }

  remove(container: HTMLElement) {
    const portal = this.portals.get(container)
    this.portals.delete(container)
    this.dispatcher.emit(PORTALS_DELETE, { portal, container })
  }

  subscribe(event: string, cb: (data: MountedPortal) => void) {
    this.dispatcher.on(event, cb)
  }

  unsubscribe(event: string, cb: (data: MountedPortal) => void) {
    this.dispatcher.off(event, cb)
  }
}
