import { Schema } from 'prosemirror-model'

export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      group: 'block',
      content: 'inline*',
      attrs: {
        spellcheck: { default: 'false' },
      },
      parseDOM: [{ tag: 'p' }],
      toDOM(node) { return ['p', node.attrs, 0] }
    },
    underline: {
      group: 'block',
      content: 'inline*',
      attrs: {
        spellcheck: { default: 'false' },
      },
      parseDOM: [{ tag: 'p' }],
      toDOM(node) { return ['p', node.attrs, 0] }
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
    pmblockquote: {
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
    text: {
      group: 'inline'
    },
  }
})
