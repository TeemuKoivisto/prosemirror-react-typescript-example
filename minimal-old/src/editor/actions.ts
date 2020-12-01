import { EditorState, Transaction, } from 'prosemirror-state'

import { schema } from './schema'

export function createNewUnderline(state: EditorState, dispatch: (tr: Transaction) => void) {
  const {$from, $to} = state.selection
  let empty = schema.nodes.underline.createAndFill(null)
  if (empty) {
    const tr = state.tr.insert($to.pos, empty)
    dispatch(tr)
    return true
  }
  return false
}
