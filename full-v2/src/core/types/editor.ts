import React from 'react'
import { EditorView } from 'prosemirror-view'

import { EditorContext } from '@context'

export type EditorAppearance = 'full-page'

export interface EditorProps {
  children: React.ReactNode
  disabled?: boolean
  appearance?: EditorAppearance
  onEditorReady?: (ctx: EditorContext) => void
  onDocumentEdit?: (editorView: EditorView) => void
}
