import React, { createContext, useContext } from 'react'

import { EditorActions } from './EditorActions'
import { PluginsProvider } from './PluginsProvider'
import { PortalProvider } from '../react/portals/PortalProvider'

export const EditorContext = createContext<{
  portalProvider: PortalProvider
  editorActions: EditorActions
  pluginsProvider: PluginsProvider
}>({
  portalProvider: new PortalProvider(),
  editorActions: new EditorActions(),
  pluginsProvider: new PluginsProvider(),
})

export const useEditorContext = () => useContext(EditorContext)
