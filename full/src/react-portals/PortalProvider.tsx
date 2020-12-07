import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PubSub from 'pubsub-js'

type MountedPortal = {
  component: React.ReactElement | null
}
export type Portals = Map<HTMLElement, MountedPortal>

export const PORTALS_EVENT_KEY = 'portals-update'

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
