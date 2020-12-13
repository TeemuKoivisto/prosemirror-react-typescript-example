import React, { createContext, useContext } from 'react'

import { EditorActions } from './EditorActions'
import { EditorPlugins } from './EditorPlugins'
import { PortalProvider } from '../react/portals/PortalProvider'

export const EditorContext = createContext<{
  portalProvider: PortalProvider
  editorActions: EditorActions
  editorPlugins: EditorPlugins
}>({
  portalProvider: new PortalProvider(),
  editorActions: new EditorActions(),
  editorPlugins: new EditorPlugins(),
})

export const useEditorContext = () => useContext(EditorContext)
