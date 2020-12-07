import React, { useEffect, useReducer, useState } from 'react'
import { createPortal } from 'react-dom'
import PubSub from 'pubsub-js'

type MountedPortal = {
  component: React.ReactElement
}
type Portals = Map<HTMLElement, MountedPortal>

const PORTALS_EVENT_KEY = 'portals-update'

export function PortalRenderer() {
  const [_ignored, forceUpdate] = useReducer(x => x + 1, 0)
  const [portals, setPortals] = useState<Map<HTMLElement, MountedPortal>>(new Map())
  useEffect(() => {
    const token = PubSub.subscribe(PORTALS_EVENT_KEY, onPortalsUpdate)
    return () => {
      PubSub.unsubscribe(token)
    }
  }, [])
  const onPortalsUpdate = (msg: string, data: Portals) => {
    setPortals(data)
    forceUpdate()
    console.log('update portals', data)
  }
  return (
    <>
    {Array.from(portals.entries()).map(([dom, values]) =>
      createPortal(values.component, dom),
    )}
    </>
  )
}
