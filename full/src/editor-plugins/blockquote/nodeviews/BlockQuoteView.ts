import { NodeView, EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { PortalProvider } from '../../../react/portals'
import { ReactNodeView } from '../../../react/ReactNodeView'

import { BlockQuote } from '../ui/BlockQuote'

import { BlockQuoteOptions, IViewProps, IBlockQuoteAttrs } from '..'
import { PluginsProvider } from '../../../core'

export class BlockQuoteView extends ReactNodeView<IViewProps, IBlockQuoteAttrs> {
  createContentDOM() {
    const contentDOM = document.createElement('div')
    contentDOM.classList.add(`${this.node.type.name}__content-dom`)
    return contentDOM
  }
}

export function blockQuoteNodeView(
  portalProvider: PortalProvider,
  pluginsProvider: PluginsProvider,
  options?: BlockQuoteOptions,
) {
  return (node: PMNode, view: EditorView, getPos: (() => number) | boolean): NodeView =>
    new BlockQuoteView(
      node,
      view,
      getPos,
      portalProvider,
      pluginsProvider,
      {
        options,
      },
      BlockQuote
    ).init()
}
