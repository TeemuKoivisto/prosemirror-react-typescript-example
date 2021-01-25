import React, { useEffect, useReducer, useState } from 'react'

import { useEditorContext } from '../../core/EditorContext'

/**
 * Component to render the mounted nodeViews as portals to allow them to share React context.
 * 
 * However, in my experimentations I've noticed this to be considerably slower than the plain old
 * ReactDOM.render. Maybe it was due to the fact that the updates in the nodeViews trigged this component
 * to immediately re-render all the portals without buffering them to a map first (which I now do with pendingUpdates).
 * 
 * I have not tried this since adding that flush mechanism but I still think its slower. Although it's
 * evident that React does not batch the updates currently with multiple subsequent render-calls and
 * firing the updates with an event listener. Will see if I restore this and do some benchmarking.
 */
export function PortalRenderer() {
  // const { portalProvider } = useEditorContext()
  // const [_ignored, forceUpdate] = useReducer(x => x + 1, 0)
  const [portals, setPortals] = useState<Map<HTMLElement, React.ReactPortal>>(new Map())

  // useEffect(() => {
  //   const disposer = portalProvider.onFlush(onUpdatePortals)
  //   return () => {
  //     disposer()
  //   }
  // }, [])

  // const onUpdatePortals = (newPortals: Map<HTMLElement, React.ReactPortal>) => {
  //   setPortals(newPortals)
  //   forceUpdate()
  // }

  return (
    <>
      {Array.from(portals.entries()).map(([container, portal]) =>
        portal
      )}
    </>
  )
}
