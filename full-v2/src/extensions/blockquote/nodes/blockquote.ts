import { NodeSpec } from 'prosemirror-model'

export const blockquote: NodeSpec = {
  content: 'paragraph+',
  group: 'block',
  defining: true,
  selectable: false,
  attrs: {
    class: { default: '' },
  },
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0]
  },
}
