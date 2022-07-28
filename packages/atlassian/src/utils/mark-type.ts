import { toggleMark } from 'prosemirror-commands'
import {
  Fragment,
  Mark as PMMark,
  MarkType,
  Node,
  NodeRange,
  NodeType,
  ResolvedPos,
  Schema,
  Slice,
} from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state'

// import { FakeTextCursorSelection } from '../plugins/fake-text-cursor/cursor';

function isMarkTypeCompatibleWithMark(markType: MarkType, mark: PMMark): boolean {
  return !mark.type.excludes(markType) && !markType.excludes(mark.type)
}

function isMarkTypeAllowedInNode(markType: MarkType, state: EditorState): boolean {
  return toggleMark(markType)(state)
}

/**
 * Check if a mark is allowed at the current selection / cursor based on a given state.
 * This method looks at both the currently active marks on the transaction, as well as
 * the node and marks at the current selection to determine if the given mark type is
 * allowed.
 */
export function isMarkTypeAllowedInCurrentSelection(markType: MarkType, state: EditorState) {
  // if (state.selection instanceof FakeTextCursorSelection) {
  //   return true;
  // }

  if (!isMarkTypeAllowedInNode(markType, state)) {
    return false
  }

  const { empty, $cursor, ranges } = state.selection as TextSelection
  if (empty && !$cursor) {
    return false
  }

  const isCompatibleMarkType = (mark: PMMark) => isMarkTypeCompatibleWithMark(markType, mark)

  // Handle any new marks in the current transaction
  if (state.tr.storedMarks && !state.tr.storedMarks.every(isCompatibleMarkType)) {
    return false
  }

  if ($cursor) {
    return $cursor.marks().every(isCompatibleMarkType)
  }

  // Check every node in a selection - ensuring that it is compatible with the current mark type
  return ranges.every(({ $from, $to }) => {
    let allowedInActiveMarks =
      $from.depth === 0 ? state.doc.marks.every(isCompatibleMarkType) : true

    state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      allowedInActiveMarks = allowedInActiveMarks && node.marks.every(isCompatibleMarkType)
    })

    return allowedInActiveMarks
  })
}
