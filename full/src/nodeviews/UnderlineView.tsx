import React from 'react'
import { NodeView, EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { PortalProvider } from '../react-portals'
import { ReactNodeView, ForwardRef, getPosHandler } from './ReactNodeView'

export interface IProps {
}

export class UnderlineView extends ReactNodeView<IProps> {
  getContentDOM() {
    const dom = document.createElement('div')
    dom.classList.add(`${this.node.type.name}-dom-wrapper`);
    return {
      dom
    }
  }

  render(_props: {}, forwardRef: ForwardRef) {
    return (
      <p ref={forwardRef} style={{textDecoration: 'underline'}}/>
    )
  }
}

export function underlineNodeView(
  portalProvider: PortalProvider,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new UnderlineView(
      node,
      view,
      getPos,
      portalProvider,
    ).init()
}
