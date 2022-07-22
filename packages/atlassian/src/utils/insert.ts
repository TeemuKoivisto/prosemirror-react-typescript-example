import {
  Node as PMNode,
  Fragment,
} from 'prosemirror-model';
import {
  Transaction,
  EditorState,
  NodeSelection,
  Selection,
} from 'prosemirror-state';

import { safeInsert as pmSafeInsert } from '@example/prosemirror-utils'

import { isChromeWithSelectionBug, normaliseNestedLayout } from './selection';

/**
 * Method extracted from typeahed plugin to be shared with the element browser on handling element insertion.
 */
export const insertSelectedItem = (
  maybeNode?: PMNode | Object | string | Fragment,
  opts: { selectInlineNode?: boolean } = {},
) => (
  state: EditorState,
  tr: Transaction,
  start: number,
): Transaction => {
  if (!maybeNode) {
    return tr;
  }

  const isInputFragment = maybeNode instanceof Fragment;
  let node
  try {
    node =
      maybeNode instanceof PMNode || isInputFragment
        ? maybeNode
        : typeof maybeNode === 'string'
        ? state.schema.text(maybeNode)
        : PMNode.fromJSON(state.schema, maybeNode);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return tr;
  }

  if (node instanceof PMNode && node.isText) {
    tr = tr.replaceWith(start, start, node);

    /**
     *
     * Replacing a type ahead query mark with a block node.
     *
     */
  } else if (node instanceof PMNode && node.isBlock) {
    tr = pmSafeInsert(normaliseNestedLayout(state, node), undefined, true)(tr);

    /**
     *
     * Replacing a type ahead query mark with an inline node.
     *
     */
  } else if ((node instanceof PMNode && node.isInline) || isInputFragment) {
    const fragment = node instanceof Fragment
      ? node
      : Fragment.fromArray([node, state.schema.text(' ')]);

    tr = tr.replaceWith(start, start, fragment);

    // This problem affects Chrome v58+. See: https://github.com/ProseMirror/prosemirror/issues/710
    if (isChromeWithSelectionBug) {
      const selection = document.getSelection();
      if (selection) {
        selection.empty();
      }
    }

    if (opts.selectInlineNode) {
      // Select inserted node
      tr = tr.setSelection(NodeSelection.create(tr.doc, start));
    } else {
      // Placing cursor after node + space.
      tr = tr.setSelection(
        Selection.near(tr.doc.resolve(start + fragment.size)),
      );
    }
  }

  return tr;
};
