import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';
import { MarksObject, NoMark } from '../marks-obj';
import { Inline } from '../inline-content';

/**
 * @name paragraph_node
 */
export interface ParagraphBaseDefinition {
  type: 'paragraph';
  /**
   * @allowUnsupportedInline true
   */
  content?: Array<Inline>;
  marks?: Array<any>;
}

/**
 * @name paragraph_with_no_marks_node
 */
export type ParagraphDefinition = ParagraphBaseDefinition & NoMark;

/**
 * NOTE: Need this because TS is too smart and inline everything.
 * So we need to give them separate identity.
 * Probably there's a way to solve it but that will need time and exploration.
 * // http://bit.ly/2raXFX5
 * type T1 = X | Y
 * type T2 = A | T1 | B // T2 = A | X | Y | B
 */

// export type ParagraphWithMarksDefinition =
//   | ParagraphWithAlignmentDefinition
//   | ParagraphWithIndentationDefinition;

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
