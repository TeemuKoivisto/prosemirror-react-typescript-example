import React, { useMemo } from 'react'

import { ReactEditorView } from './ReactEditorView'
import { EditorContext, EditorActions, PluginsProvider } from './core'
import { PortalProvider, PortalRenderer } from './react/portals'

import { FullPage } from './ui/FullPage'

import { EditorAppearance } from './types/editor-ui'

export interface EditorProps {
  appearance?: EditorAppearance
}

const components = {
  'full-page': FullPage,
}

export function Editor(props: EditorProps) {
  const {
    appearance = 'full-page',
  } = props
  const editorActions = useMemo(() => new EditorActions, [])
  const portalProvider = useMemo(() => new PortalProvider, [])
  const pluginsProvider = useMemo(() => new PluginsProvider, [])
  const Component = useMemo(() => components[appearance], [appearance])

  return (
    <EditorContext.Provider value={{
      editorActions,
      portalProvider,
      pluginsProvider,
    }}>
      <ReactEditorView
        editorProps={props}
        EditorLayoutComponent={Component}
      />
      <PortalRenderer/>
    </EditorContext.Provider>
  )
}
