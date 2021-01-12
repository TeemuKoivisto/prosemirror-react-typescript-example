import { EditorState, Transaction, } from 'prosemirror-state'

export function createNewBlockQuote(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const {$from, $to} = state.selection
  const blockquote = state.schema.nodes.blockquote;
  const empty = blockquote.createAndFill()
  const endOfBlock = $from.end()
  if (empty && dispatch) {
    const tr = state.tr.insert(endOfBlock + 1, empty)
    dispatch(tr)
  }
  return false
}

export function createNewPmBlockQuote(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const {$from, $to} = state.selection
  const blockquote = state.schema.nodes.pmBlockquote;
  const empty = blockquote.createAndFill()
  const endOfBlock = $from.end()
  if (empty && dispatch) {
    const tr = state.tr.insert(endOfBlock + 1, empty)
    dispatch(tr)
  }
  return false
}
