import { NodeSpec } from 'prosemirror-model';
import { ParagraphDefinition } from './paragraph';

/**
 * @name doc_node
 */
export interface DocNode {
  version: 1;
  type: 'doc';
  /**
   * @allowUnsupportedBlock true
   */
  content: Array<
    // | BlockContent
    // | LayoutSection
    // | CodeBlockWithMarks
    // | ExpandWithBreakout
    | ParagraphDefinition
  >;
}

export const doc: NodeSpec = {
  content: 'block+',
  // marks:
  //   'alignment breakout indentation link unsupportedMark unsupportedNodeAttribute',
};
