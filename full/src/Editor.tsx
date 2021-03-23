import React, { useMemo } from 'react'
import { EditorView } from 'prosemirror-view'

import { ReactEditorView } from './ReactEditorView'
import { EditorContext, EditorViewProvider, PluginsProvider, AnalyticsProvider } from './core'
import { PortalProvider, PortalRenderer } from './react/portals'

import { FullPage } from './ui/FullPage'

import { AnalyticsProps } from './core/AnalyticsProvider'
import { EditorAppearance } from './types/editor-ui'

export interface EditorProps {
  disabled?: boolean
  shouldTrack?: boolean
  analytics?: AnalyticsProps
  appearance?: EditorAppearance
  collab?: {
    documentId: string
  }
  onEditorReady?: (viewProvider: EditorViewProvider) => void
  onDocumentEdit?: (editorView: EditorView) => void
}

const components = {
  'full-page': FullPage,
}

export function Editor(props: EditorProps) {
  const {
    appearance = 'full-page',
  } = props
  // These three have to be inside useMemos for SSR compatibility
  const viewProvider = useMemo(() => new EditorViewProvider, [])
  const portalProvider = useMemo(() => new PortalProvider, [])
  const pluginsProvider = useMemo(() => new PluginsProvider, [])
  const analyticsProvider = useMemo(() => new AnalyticsProvider(props.analytics), [])
  const Component = useMemo(() => components[appearance], [appearance])

  return (
    <EditorContext.Provider value={{
      viewProvider,
      portalProvider,
      pluginsProvider,
      analyticsProvider
    }}>
      <ReactEditorView
        editorProps={props}
        EditorLayoutComponent={Component}
      />
      <PortalRenderer />
    </EditorContext.Provider>
  )
}

Editor.displayName = 'FullEditor'
