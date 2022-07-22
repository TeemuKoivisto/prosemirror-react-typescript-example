import { useEffect, useState } from 'react'
import { PortalProvider } from '../portals/PortalProvider'

export function createListenProps<A>(container: HTMLElement, portalProvider: PortalProvider) {
  return function (cb: (newProps: A) => void) {
    useEffect(() => {
      portalProvider.subscribe(container, cb)
      return () => {
        portalProvider.unsubscribe(container, cb)
      }
    }, [])
  }
}
