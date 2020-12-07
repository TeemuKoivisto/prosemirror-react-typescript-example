import React, { createContext, useContext } from 'react'

import { EditorActions } from './EditorActions'
import { PortalProvider } from '../react-portals/PortalProvider'

export const EditorContext = createContext<{
  editorActions: EditorActions
  portalProvider: PortalProvider
}>({
  editorActions: new EditorActions(),
  portalProvider: new PortalProvider()
})

export const useEditorContext = () => useContext(EditorContext)
