import { NodeView, EditorView, Decoration, DecorationSource } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { ReactNodeView } from '../../../react/ReactNodeView'

import { BlockQuote } from '../ui/BlockQuote'

import { BlockQuoteOptions, IViewProps, IBlockQuoteAttrs } from '..'
import { EditorContext } from '../../../core/EditorContext'

export class BlockQuoteView extends ReactNodeView<IViewProps, IBlockQuoteAttrs> {
  createContentDOM() {
    const contentDOM = document.createElement('div')
    contentDOM.classList.add(`${this.node.type.name}__content-dom`)
    return contentDOM
  }
}

export function blockQuoteNodeView(
  ctx: EditorContext,
  options?: BlockQuoteOptions,
) {
  return (
    node: PMNode,
    view: EditorView,
    getPos: () => number,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource
  ): NodeView =>
    new BlockQuoteView(
      node,
      view,
      getPos,
      decorations,
      innerDecorations,
      ctx,
      {
        options,
      },
      BlockQuote
    ).init()
}
