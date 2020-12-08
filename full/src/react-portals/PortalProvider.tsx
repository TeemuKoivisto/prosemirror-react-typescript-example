import React from 'react'
import { createPortal } from 'react-dom'
import PubSub from 'pubsub-js'

export const PORTALS_UPDATE = 'portals-update'
export const PORTALS_DELETE = 'portals-delete'

export class PortalProvider {

  portals: Map<HTMLElement, React.ReactPortal> = new Map()

  render(
    component: React.ReactElement,
    container: HTMLElement,
  ) {
    // Do _not_ update portals incase the element has already been rendered with createPortal
    if (this.portals.has(container)) {
      return
    }
    const portal = createPortal(component, container)
    this.portals.set(container, portal)
    PubSub.publish(PORTALS_UPDATE, { portal, container })
  }

  remove(container: HTMLElement) {
    const portal = this.portals.get(container)
    this.portals.delete(container)
    PubSub.publish(PORTALS_DELETE, { portal, container })
  }
}
