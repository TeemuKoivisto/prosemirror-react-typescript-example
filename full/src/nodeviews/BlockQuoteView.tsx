import React from 'react'
import { NodeView, EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { PortalProvider } from '../react-portals'
import { ReactNodeView, ForwardRef, getPosHandler } from './ReactNodeView'

import { BlockQuote } from './BlockQuote'

export interface IProps {
}

export class BlockQuoteView extends ReactNodeView<IProps> {
  getContentDOM() {
    const dom = document.createElement('div')
    dom.classList.add(`${this.node.type.name}-dom-wrapper`);
    return {
      dom
    }
  }

  render(_props: {}, forwardRef: ForwardRef) {
    return (
      <BlockQuote ref={forwardRef}/>
    )
  }
}

export function blockQuoteNodeView(
  portalProvider: PortalProvider,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new BlockQuoteView(
      node,
      view,
      getPos,
      portalProvider,
    ).init()
}
