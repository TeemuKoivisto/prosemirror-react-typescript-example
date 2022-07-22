import { NodeSpec } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';

/**
 * @name blockquote_node
 */
export interface BlockQuoteDefinition {
  type: 'blockquote';
  /**
   * @minItems 1
   */
  content: Array<Paragraph>;
}

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
    return ['blockquote', 0];
  },
}

export const pmBlockquote: NodeSpec = {
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
}
