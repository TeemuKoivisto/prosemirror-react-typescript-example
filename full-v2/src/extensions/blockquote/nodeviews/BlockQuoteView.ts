import { NodeView, EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { ReactNodeView } from '@react'
import { EditorContext } from '@context'

import { BlockQuote } from '../ui/BlockQuote'

import { BlockQuoteOptions, IViewProps, IBlockQuoteAttrs } from '..'

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
  return (node: PMNode, view: EditorView, getPos: (() => number) | boolean): NodeView =>
    new BlockQuoteView(
      node,
      view,
      getPos,
      ctx,
      {
        options,
      },
      BlockQuote
    ).init()
}
