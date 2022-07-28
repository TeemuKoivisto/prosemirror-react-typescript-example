import { EditorState, Selection } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'

import { Command } from '@core'

export const replaceDocument =
  (doc: any, version: number): Command =>
  (state, dispatch): boolean => {
    const { schema, tr } = state

    const content: PMNode[] = (doc.content || []).map((child: any) => schema.nodeFromJSON(child))
    const hasContent = !!content.length

    if (hasContent) {
      tr.setMeta('addToHistory', false)
      tr.replaceWith(0, state.doc.nodeSize - 2, content!)
      tr.setSelection(Selection.atStart(tr.doc))
      tr.setMeta('replaceDocument', true)

      if (version) {
        const collabState = { version, unconfirmed: [] }
        tr.setMeta('collab$', collabState)
      }
    }

    dispatch!(tr)
    return true
  }

export const setCollab =
  (version: number): Command =>
  (state, dispatch): boolean => {
    const collabState = { version, unconfirmed: [] }
    if (dispatch) {
      const tr = state.tr.setMeta('collab$', collabState)
      dispatch(tr)
    }
    return false
  }
