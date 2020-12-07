import React from 'react'
import { createPortal } from 'react-dom'
import PubSub from 'pubsub-js'

export const PORTALS_UPDATE = 'portals-update'
export const PORTALS_DELETE = 'portals-delete'

type MountedPortal = {
  id: Symbol
  portal: React.ReactPortal
}
export type Portals = Map<HTMLElement, MountedPortal>

export class PortalProvider {

  portals: Map<HTMLElement, MountedPortal> = new Map()

  render(
    component: React.ReactElement,
    container: HTMLElement,
  ) {
    // Do _not_ update portals incase the element has already been rendered with createPortal
    if (this.portals.has(container)) {
      return
    }
    const portal = createPortal(component, container)
    const obj = { id: Symbol('portal-id'), portal }
    this.portals.set(container, obj)
    PubSub.publish(PORTALS_UPDATE, obj)
  }

  remove(container: HTMLElement) {
    const obj = this.portals.get(container)
    this.portals.delete(container)
    PubSub.publish(PORTALS_UPDATE, obj)
  }
}
