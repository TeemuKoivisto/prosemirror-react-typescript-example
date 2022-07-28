import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state'
import { canSplit } from 'prosemirror-transform'
import { Fragment } from 'prosemirror-model'

export function splitBlock(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const { $from, $to } = state.selection
  if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
    if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) return false
    if (dispatch) dispatch(state.tr.split($from.pos).scrollIntoView())
    return true
  }

  if (!$from.parent.isBlock) return false

  if (dispatch) {
    const atEnd = $to.parentOffset == $to.parent.content.size
    const tr = state.tr
    if (state.selection instanceof TextSelection) tr.deleteSelection()
    const deflt =
      $from.depth == 0 ? undefined : $from.node(-1).contentMatchAt($from.indexAfter(-1)).defaultType
    let types = atEnd && deflt ? [{ type: deflt }] : undefined
    let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types)
    if (
      !types &&
      !can &&
      deflt &&
      canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt && [{ type: deflt }])
    ) {
      types = [{ type: deflt }]
      can = true
    }
    if (can && deflt) {
      tr.split(tr.mapping.map($from.pos), 1, types)
      const isStuff = !atEnd && !$from.parentOffset && $from.parent.type != deflt
      const canReplace = $from
        .node(-1)
        .canReplace($from.index(-1), $from.indexAfter(-1), Fragment.from(deflt.create()))
      if (isStuff && canReplace) {
        tr.setNodeMarkup(tr.mapping.map($from.before()), deflt)
      }
    }
    dispatch(tr.scrollIntoView())
  }
  return true
}

export function createParagraphNear(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const { $from, $to } = state.selection
  if ($from.parent.inlineContent || $to.parent.inlineContent) return false
  const type = $from.parent.contentMatchAt($to.indexAfter()).defaultType
  if (!type || !type.isTextblock) return false
  const empty = type.createAndFill()
  debugger
  if (dispatch && empty) {
    const side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos
    const tr = state.tr.insert(side, empty)
    tr.setSelection(TextSelection.create(tr.doc, side + 1))
    dispatch(tr.scrollIntoView())
  }
  return true
}
