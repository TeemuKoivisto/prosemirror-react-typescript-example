import { Node } from 'prosemirror-model'
import { EditorView, Decoration } from 'prosemirror-view'

import { BlockQuoteView } from './BlockQuoteView'

export const nodeViews = {
  blockquote: (node: Node, view: EditorView, getPos: () => number) =>
    new BlockQuoteView(node, view, getPos),
}
