import { NodeSelection, Selection, Transaction } from 'prosemirror-state';
import { Node as PMNode, Fragment, NodeType, ResolvedPos } from 'prosemirror-model';

export const canInsert = ($pos: ResolvedPos, content: PMNode | Fragment) => {
  const index = $pos.index();

  if (content instanceof Fragment) {
    return $pos.parent.canReplace(index, index, content);
  } else if (content instanceof PMNode) {
    return $pos.parent.canReplaceWith(index, index, content.type);
  }
  return false;
};