import React from 'react'
import PubSub from 'pubsub-js'

export const PORTALS_EVENT_KEY = 'portals-update'

type MountedPortal = {
  component: React.ReactElement | null
}
export type Portals = Map<HTMLElement, MountedPortal>

export class PortalProvider {

  portals: Map<HTMLElement, MountedPortal> = new Map()

  render(
    component: React.ReactElement,
    container: HTMLElement,
  ) {
    // console.log('create portal')
    const u = this.portals.set(container, { component: component })
    PubSub.publish(PORTALS_EVENT_KEY, u)
  }

  remove(container: HTMLElement) {
    this.portals.delete(container)
    // console.log('delete portal', this.portals)
    PubSub.publish(PORTALS_EVENT_KEY, this.portals)
  }
}
