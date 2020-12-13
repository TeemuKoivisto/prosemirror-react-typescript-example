import React from 'react'
import { NodeView, EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { PortalProvider } from '../../../react/portals'
import { ReactNodeView, ForwardRef } from '../../../react/ReactNodeView'

import { BlockQuote } from '../ui/BlockQuote'

import { BlockQuoteOptions } from '../'
import { EditorPlugins } from '../../../core'

export interface IProps {
  options?: BlockQuoteOptions;
}

export class BlockQuoteView extends ReactNodeView<IProps> {
  createContentDOM() {
    const wrapper = document.createElement('div')
    wrapper.classList.add(`${this.node.type.name}-dom-wrapper`);
    return {
      wrapper
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
  editorPlugins: EditorPlugins,
  options?: BlockQuoteOptions,
) {
  return (node: PMNode, view: EditorView, getPos: (() => number) | boolean): NodeView =>
    new BlockQuoteView(
      node,
      view,
      getPos,
      portalProvider,
      editorPlugins,
      {
        options,
      },
    ).init()
}
