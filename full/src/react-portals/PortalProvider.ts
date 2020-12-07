import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PubSub from 'pubsub-js'

type MountedPortal = {
  // component: React.ReactElement
  children: () => React.ReactChild | null
}
export type Portals = Map<HTMLElement, MountedPortal>
interface PortalsProps {
  // portals: Map<HTMLElement, MountedPortal>
  portals: Map<HTMLElement, React.ReactChild>
}

const PORTALS_EVENT_KEY = 'portals-update'

export class PortalProvider {

  portals: Map<HTMLElement, MountedPortal> = new Map()

  createPortal(
    component: React.ReactElement,
    container: HTMLElement,
  ) {
    // console.log('create portal')
    // const u = this.portals.set(container, { component })
    // PubSub.publish(PORTALS_EVENT_KEY, u)
    // ReactDOM.createPortal(
    //   component,
    //   container,
    // )
  }

  render(children: () => React.ReactChild | null, container: HTMLElement) {
    const u = this.portals.set(container, { children })
    PubSub.publish(PORTALS_EVENT_KEY, u)
  }

  remove(container: HTMLElement) {
    this.portals.delete(container)
    console.log('delete', this.portals)
    // ReactDOM.unmountComponentAtNode(container)
    PubSub.publish(PORTALS_EVENT_KEY, this.portals)
  }
}
