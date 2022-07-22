import React, { createContext, useContext } from 'react'

import { EditorViewProvider } from './EditorViewProvider'
import { PluginsProvider } from './PluginsProvider'
import { PortalProvider } from '../react/portals/PortalProvider'
import { AnalyticsProvider } from './AnalyticsProvider'

export interface EditorContext {
  portalProvider: PortalProvider
  viewProvider: EditorViewProvider
  pluginsProvider: PluginsProvider
  analyticsProvider: AnalyticsProvider
}

export const Context = createContext<EditorContext>({
  portalProvider: new PortalProvider(),
  viewProvider: new EditorViewProvider(),
  pluginsProvider: new PluginsProvider(),
  analyticsProvider: new AnalyticsProvider(),
})

export const useEditorContext = () => useContext(Context)
