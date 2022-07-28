import { NodeSelection, Selection, Transaction } from 'prosemirror-state'
import { Node as PMNode, Fragment, NodeType, ResolvedPos } from 'prosemirror-model'
import { findParentNodeOfType } from '@example/prosemirror-utils'

import { canInsert } from './helpers'

// (tr: Transaction) → Transaction
// Creates a new transaction object from a given transaction
export const cloneTr = (tr: Transaction) => {
  return Object.assign(Object.create(tr), tr).setTime(Date.now())
}

export const replaceNodeAtPos =
  (position: number, content: PMNode | Fragment) => (tr: Transaction) => {
    const node = tr.doc.nodeAt(position)
    const $pos = tr.doc.resolve(position)
    if (canReplace($pos, content)) {
      tr = tr.replaceWith(position, position + (node?.nodeSize || 0), content)
      const start = tr.selection.$from.pos - 1
      // put cursor inside of the inserted node
      tr = setTextSelection(Math.max(start, 0), -1)(tr)
      // move cursor to the start of the node
      tr = setTextSelection(tr.selection.$from.start())(tr)
      return cloneTr(tr)
    }
    return tr
  }

// ($pos: ResolvedPos, doc: ProseMirrorNode, content: union<ProseMirrorNode, Fragment>, ) → boolean
// Checks if replacing a node at a given `$pos` inside of the `doc` node with the given `content` is possible.
export const canReplace = ($pos: ResolvedPos, content: PMNode | Fragment) => {
  const node = $pos.node($pos.depth)
  return (
    node && node.type.validContent(content instanceof Fragment ? content : Fragment.from(content))
  )
}

// (node: ProseMirrorNode) → boolean
// Checks if a given `node` is an empty paragraph
export const isEmptyParagraph = (node: PMNode | Fragment) => {
  return !node || (node instanceof PMNode && node.type.name === 'paragraph' && node.nodeSize === 2)
}

export const replaceParentNodeOfType =
  (nodeType: NodeType | NodeType[], content: PMNode | Fragment) => (tr: Transaction) => {
    if (!Array.isArray(nodeType)) {
      nodeType = [nodeType]
    }
    for (let i = 0, count = nodeType.length; i < count; i++) {
      const parent = findParentNodeOfType(nodeType[i])(tr.selection)
      if (parent) {
        const newTr = replaceNodeAtPos(parent.pos, content)(tr)
        if (newTr !== tr) {
          return newTr
        }
      }
    }
    return tr
  }

export const replaceSelectedNode = (content: PMNode | Fragment) => (tr: Transaction) => {
  if (tr.selection instanceof NodeSelection) {
    const { $from, $to } = tr.selection
    if (
      (content instanceof Fragment &&
        $from.parent.canReplace($from.index(), $from.indexAfter(), content)) ||
      (content instanceof PMNode &&
        $from.parent.canReplaceWith($from.index(), $from.indexAfter(), content.type))
    ) {
      return cloneTr(
        tr
          .replaceWith($from.pos, $to.pos, content)
          // restore node selection
          .setSelection(new NodeSelection(tr.doc.resolve($from.pos)))
      )
    }
  }
  return tr
}

export const setTextSelection =
  (position: number, dir = 1) =>
  (tr: Transaction) => {
    const nextSelection = Selection.findFrom(tr.doc.resolve(position), dir, true)
    if (nextSelection) {
      return tr.setSelection(nextSelection)
    }
    return tr
  }

const isSelectableNode = (node: PMNode | Fragment) =>
  node instanceof PMNode && node.type && node.type.spec.selectable
const shouldSelectNode = (node: PMNode | Fragment) =>
  node instanceof PMNode && isSelectableNode(node) && node.type.isLeaf

const setSelection = (node: PMNode | Fragment, pos: number, tr: Transaction) => {
  if (shouldSelectNode(node)) {
    return tr.setSelection(new NodeSelection(tr.doc.resolve(pos)))
  }
  return setTextSelection(pos)(tr)
}

// :: (content: union<ProseMirrorNode, Fragment>, position: ?number, tryToReplace?: boolean) → (tr: Transaction) → Transaction
// Returns a new transaction that inserts a given `content` at the current cursor position, or at a given `position`, if it is allowed by schema. If schema restricts such nesting, it will try to find an appropriate place for a given node in the document, looping through parent nodes up until the root document node.
// If `tryToReplace` is true and current selection is a NodeSelection, it will replace selected node with inserted content if its allowed by schema.
// If cursor is inside of an empty paragraph, it will try to replace that paragraph with the given content. If insertion is successful and inserted node has content, it will set cursor inside of that content.
// It will return an original transaction if the place for insertion hasn't been found.
//
// ```javascript
// const node = schema.nodes.extension.createChecked({});
// dispatch(
//   safeInsert(node)(tr)
// );
// ```
export const safeInsert =
  (content: PMNode | Fragment, position?: number, tryToReplace?: boolean) => (tr: Transaction) => {
    const hasPosition = typeof position === 'number'
    const { $from } = tr.selection
    const $insertPos = hasPosition
      ? tr.doc.resolve(position)
      : tr.selection instanceof NodeSelection
      ? tr.doc.resolve($from.pos + 1)
      : $from
    const { parent } = $insertPos

    // try to replace selected node
    if (tr.selection instanceof NodeSelection && tryToReplace) {
      const oldTr = tr
      tr = replaceSelectedNode(content)(tr)
      if (oldTr !== tr) {
        return tr
      }
    }

    // try to replace an empty paragraph
    if (isEmptyParagraph(parent)) {
      const oldTr = tr
      tr = replaceParentNodeOfType(parent.type, content)(tr)
      if (oldTr !== tr) {
        const pos = isSelectableNode(content)
          ? // for selectable node, selection position would be the position of the replaced parent
            $insertPos.before($insertPos.depth)
          : $insertPos.pos
        return setSelection(content, pos, tr)
      }
    }

    // given node is allowed at the current cursor position
    if (canInsert($insertPos, content)) {
      tr.insert($insertPos.pos, content)
      const pos = hasPosition
        ? $insertPos.pos
        : isSelectableNode(content)
        ? // for atom nodes selection position after insertion is the previous pos
          tr.selection.$anchor.pos - 1
        : tr.selection.$anchor.pos
      return cloneTr(setSelection(content, pos, tr))
    }

    // looking for a place in the doc where the node is allowed
    for (let i = $insertPos.depth; i > 0; i--) {
      const pos = $insertPos.after(i)
      const $pos = tr.doc.resolve(pos)
      if (canInsert($pos, content)) {
        tr.insert(pos, content)
        return cloneTr(setSelection(content, pos, tr))
      }
    }
    return tr
  }
