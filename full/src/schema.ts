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
  },
  marks: {
    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() { return ['em', 0] }
    },
    strong: {
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        { tag: 'b', getAttrs(node: string | Node) {
          if (node instanceof HTMLElement) {
            return node.style.fontWeight !== 'normal' && null
          }
          return null
        } },
        { style: 'font-weight', getAttrs(value) {
          if (typeof value === 'string') {
            return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null 
          }
          return null
        } },
      ],
      toDOM() { return ['strong', 0] }
    },
  }
})
