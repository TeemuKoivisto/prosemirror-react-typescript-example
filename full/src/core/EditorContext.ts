import React, { createContext, useContext } from 'react'

import { EditorViewProvider } from './EditorViewProvider'
import { PluginsProvider } from './PluginsProvider'
import { PortalProvider } from '../react/portals/PortalProvider'
import { AnalyticsProvider } from './AnalyticsProvider'

export const EditorContext = createContext<{
  portalProvider: PortalProvider
  viewProvider: EditorViewProvider
  pluginsProvider: PluginsProvider
  analyticsProvider: AnalyticsProvider
}>({
  portalProvider: new PortalProvider(),
  viewProvider: new EditorViewProvider(),
  pluginsProvider: new PluginsProvider(),
  analyticsProvider: new AnalyticsProvider(),
})

export const useEditorContext = () => useContext(EditorContext)
