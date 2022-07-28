import { EditorState, Selection } from 'prosemirror-state'
import { findSelectedNodeOfType, findParentNodeOfType } from '@example/prosemirror-utils'

export function findBlockQuote(state: EditorState, selection?: Selection | null) {
  const { blockquote } = state.schema.nodes
  return (
    findSelectedNodeOfType(blockquote)(selection || state.selection) ||
    findParentNodeOfType(blockquote)(selection || state.selection)
  )
}
