import { Node as PMNode, NodeType } from 'prosemirror-model'
import { NodeSelection, Selection } from 'prosemirror-state'

export const equalNodeType = (nodeType: NodeType, node: PMNode) => {
  return (Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) || node.type === nodeType
}

export const findSelectedNodeOfType = (nodeType: NodeType) => (selection: Selection) => {
  if (selection instanceof NodeSelection) {
    const { node, $from } = selection
    if (equalNodeType(nodeType, node)) {
      return { node, pos: $from.pos, depth: $from.depth }
    }
  }
}
