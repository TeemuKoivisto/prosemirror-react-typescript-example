import React from 'react'
import { NodeView, EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { PortalProvider } from '../react-portals'
import { ReactNodeView, ForwardRef } from './ReactNodeView'

export interface IProps {
}

export class UnderlineView extends ReactNodeView<IProps> {
  createContentDOM() {
    const wrapper = document.createElement('div')
    wrapper.classList.add(`${this.node.type.name}__content-dom-wrapper`)
    return {
      wrapper
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
  return (node: PMNode, view: EditorView, getPos: (() => number) | boolean): NodeView =>
    new UnderlineView(
      node,
      view,
      getPos,
      portalProvider,
    ).init()
}
