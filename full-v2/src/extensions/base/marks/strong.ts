import { MarkSpec } from 'prosemirror-model'
import { FONT_STYLE } from './groups'

export interface StrongDefinition {
  type: 'strong'
}

export const strong: MarkSpec = {
  inclusive: true,
  group: FONT_STYLE,
  parseDOM: [
    { tag: 'strong' },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    {
      tag: 'b',
      getAttrs(node) {
        const element = node as HTMLElement
        return element.style.fontWeight !== 'normal' && null
      },
    },
    {
      tag: 'span',
      getAttrs(node) {
        const element = node as HTMLElement
        const { fontWeight } = element.style
        return (
          typeof fontWeight === 'string' &&
          (fontWeight === 'bold' ||
            fontWeight === 'bolder' ||
            /^(bold(er)?|[5-9]\d{2,})$/.test(fontWeight)) &&
          null
        )
      },
    },
  ],
  toDOM() {
    return ['strong']
  },
}