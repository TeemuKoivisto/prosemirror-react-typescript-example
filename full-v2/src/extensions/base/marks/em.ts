import { MarkSpec } from 'prosemirror-model'
import { FONT_STYLE } from './groups'

export interface EmDefinition {
  type: 'em'
}

export const em: MarkSpec = {
  inclusive: true,
  group: FONT_STYLE,
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM() {
    return ['em']
  },
}
