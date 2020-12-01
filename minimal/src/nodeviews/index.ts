import { Node } from 'prosemirror-model'
import { EditorView, Decoration } from 'prosemirror-view'

import { Underline } from './Underline'

export const nodeViews = {
  underline: (
    node: Node,
    view: EditorView,
    getPos: (() => number) | boolean,
    decorations: Decoration[]
  ) => new Underline(node, view, getPos, decorations),
}
