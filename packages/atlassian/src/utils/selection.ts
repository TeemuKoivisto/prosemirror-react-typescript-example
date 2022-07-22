import {
  EditorState,
} from 'prosemirror-state';
import { MarkType, Node, ResolvedPos } from 'prosemirror-model';
import { browser } from './browser'

export const normaliseNestedLayout = (state: EditorState, node: Node) => {
  if (state.selection.$from.depth > 1) {
    if (node.attrs.layout && node.attrs.layout !== 'default') {
      return node.type.createChecked(
        {
          ...node.attrs,
          layout: 'default',
        },
        node.content,
        node.marks,
      );
    }

    // If its a breakout layout, we can remove the mark
    // Since default isn't a valid breakout mode.
    const breakoutMark: MarkType = state.schema.marks.breakout;
    if (breakoutMark && breakoutMark.isInSet(node.marks)) {
      const newMarks = breakoutMark.removeFromSet(node.marks);
      return node.type.createChecked(node.attrs, node.content, newMarks);
    }
  }

  return node;
};

// @see: https://github.com/ProseMirror/prosemirror/issues/710
// @see: https://bugs.chromium.org/p/chromium/issues/detail?id=740085
// Chrome >= 58 (desktop only)
export const isChromeWithSelectionBug =
  browser.chrome && !browser.android && browser.chrome_version >= 58;
