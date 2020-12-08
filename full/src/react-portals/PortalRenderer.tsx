import React, { useEffect, useReducer } from 'react'
import PubSub from 'pubsub-js'

import { PORTALS_UPDATE, PORTALS_DELETE } from './PortalProvider'

type MountedPortal = {
  container: HTMLElement
  portal: React.ReactPortal
}

const portals: Map<HTMLElement, React.ReactPortal> = new Map()

export function PortalRenderer() {
  const [_ignored, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const token = PubSub.subscribe(PORTALS_UPDATE, onPortalsUpdate)
    const token2 = PubSub.subscribe(PORTALS_DELETE, onPortalsUpdate)
    return () => {
      PubSub.unsubscribe(token)
      PubSub.unsubscribe(token2)
    }
  }, [])

  const onPortalsUpdate = (msg: string, data: MountedPortal) => {
    if (msg === PORTALS_UPDATE) {
      portals.set(data.container, data.portal)
    } else {
      portals.delete(data.container)
    }
    forceUpdate()
  }

  return (
    <>
      {Array.from(portals.entries()).map(([dom, portal]) =>
        portal
      )}
    </>
  )
}
