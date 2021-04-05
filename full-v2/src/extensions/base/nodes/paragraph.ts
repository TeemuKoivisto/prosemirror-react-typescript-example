import { NodeSpec } from 'prosemirror-model'

export const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  selectable: false,
  // marks:
    // 'strong code em link strike subsup textColor underline unsupportedMark unsupportedNodeAttribute',
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0]
  },
}
