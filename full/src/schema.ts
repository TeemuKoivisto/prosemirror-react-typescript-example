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
    text: {
      group: 'inline'
    },
  }
})
