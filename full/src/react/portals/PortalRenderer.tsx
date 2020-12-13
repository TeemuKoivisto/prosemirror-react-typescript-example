import React, { useEffect, useReducer, useState } from 'react'

import { useEditorContext } from '../../core/EditorContext'

import { PORTALS_UPDATE, PORTALS_DELETE, MountedPortal } from './PortalProvider'

export function PortalRenderer() {
  const { portalProvider } = useEditorContext()
  const [_ignored, forceUpdate] = useReducer(x => x + 1, 0)
  const [portals] = useState<Map<HTMLElement, React.ReactPortal>>(new Map())

  useEffect(() => {
    portalProvider.subscribe(PORTALS_UPDATE, onPortalsUpdate)
    portalProvider.subscribe(PORTALS_DELETE, onPortalsDelete)
    return () => {
      portalProvider.unsubscribe(PORTALS_UPDATE, onPortalsUpdate)
      portalProvider.unsubscribe(PORTALS_DELETE, onPortalsDelete)
    }
  }, [])

  const onPortalsUpdate = (data: MountedPortal) => {
    portals.set(data.container, data.portal)
    forceUpdate()
  }

  const onPortalsDelete = (data: MountedPortal) => {
    portals.delete(data.container)
    forceUpdate()
  }

  return (
    <>
      {Array.from(portals.entries()).map(([container, portal]) =>
        portal
      )}
    </>
  )
}
