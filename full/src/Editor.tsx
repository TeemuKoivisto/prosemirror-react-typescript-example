import React, { useMemo, useState } from 'react'

import { ReactEditorView } from './ReactEditorView'
import { EditorContext } from './core/EditorContext'
import { EditorActions } from './core/EditorActions'
import { PortalProvider, PortalRenderer } from './react-portals'

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
  const Component = useMemo(() => components[appearance], [appearance])

  return (
    <EditorContext.Provider value={{
      editorActions: new EditorActions(),
      portalProvider: new PortalProvider(),
    }}>
      <ReactEditorView
        editorProps={props}
        EditorLayoutComponent={Component}
      />
      <PortalRenderer/>
    </EditorContext.Provider>
  )
}
