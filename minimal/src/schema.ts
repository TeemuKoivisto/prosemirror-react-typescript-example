import { Schema } from 'prosemirror-model'

export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      selectable: false,
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0]
      },
    },
    pmBlockquote: {
      content: 'paragraph+',
      group: 'block',
      defining: true,
      selectable: false,
      attrs: {
        class: { default: 'pm-blockquote' },
      },
      parseDOM: [{ tag: 'blockquote' }],
      toDOM(node) {
        return ['blockquote', node.attrs, 0];
      },
    },
    blockquote: {
      content: 'paragraph+',
      group: 'block',
      defining: true,
      selectable: false,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() {
        return ['blockquote', 0];
      },
    },
    text: {
      group: 'inline'
    },
  }
})
