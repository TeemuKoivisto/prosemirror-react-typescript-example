import * as React from 'react'
import { Node } from 'prosemirror-model'
import { EditorView, NodeView, Decoration } from 'prosemirror-view'

import { PortalProvider } from '../utils/PortalProvider'

// Modified from https://bitbucket.org/atlassian/atlaskit-mk-2/src/0fcae893b790443a30f7dadae00638d6e4238b2f/packages/editor/editor-core/src/nodeviews/ReactNodeView.tsx?at=master
export class ReactNodeView<T> implements NodeView {
  dom: HTMLElement
  contentDOM: HTMLElement
  ref: React.RefObject<any>

  // All the available parameters that are passed to the NodeView
  node: Node
  view: EditorView
  getPos: (() => number) | boolean
  decorations: Decoration[]
  attrs: T
  // attrs: { [key: string]: string | number}

  portalProvider: PortalProvider
  reactComponent: React.ComponentType<any>

  constructor(
    node: Node,
    view: EditorView,
    getPos: (() => number) | boolean,
    decorations: Decoration[],
    portalProvider: PortalProvider,
    reactComponent: React.ComponentType<any>,
  ) {
    this.attrs = node.attrs as T
    this.node = node
    this.view = view
    this.getPos = getPos
    this.decorations = decorations

    this.portalProvider = portalProvider
    this.reactComponent = reactComponent

    this.ref = React.createRef()

    // Here, we'll provide a container to render React into.
    // Coincidentally, this is where ProseMirror will put its
    // generated contentDOM.  React will throw out that content
    // once rendered, and at the same time we'll append it into
    // the component tree, like a fancy shell game.  This isn't
    // obvious to the user, but would it be more obvious on an
    // expensive render?
    //
    this.dom = document.createElement('span')

    // Finally, we provide an element to render content into.
    // We will be moving this node around as we need to.
    //
    this.contentDOM = document.createElement('span')

    // Just example classes to help see the structure in the DOM
    this.dom.classList.add('node__dom')
    this.contentDOM.classList.add('node__content-dom')

    this.renderReactComponent()
  }

  renderReactComponent() {
    this.portalProvider.render(
      <this.reactComponent ref={this.ref} attrs={this.attrs} contentDOM={this.contentDOM}/>,
      this.dom
    )
  }

  update(
    node: Node,
    decorations: Decoration[],
    validUpdate: (currentNode: Node, newNode: Node) => boolean = () => true,
  ) {
    // While quite uncommon, the update must be checked for consistency.
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    // The check by default returns true, and in Atlassian editor-core only 'mediaSingle' plugin
    // uses it for checking 'this.getNodeMediaId'
    const isValidUpdate =
      this.node.type === node.type && validUpdate(this.node, node)

    if (!isValidUpdate) {
      return false
    }
    // If the markup has changed, update the React component.
    // TODO only updates attrs, what about type or marks?
    // Or well basically just marks, the previous check will return false if type has changed.
    if (this.ref && !this.node.sameMarkup(node)) {
      this.attrs = node.attrs as T
      this.renderReactComponent()
    }
    this.node = node
    this.decorations = decorations

    return true
  }

  destroy() {
    this.portalProvider.remove(this.dom)
  }

  static fromComponent<T>(
    component: React.ComponentType<any>,
    portalProvider: PortalProvider,
  ) {
    return (
      node: Node,
      view: EditorView,
      getPos: (() => number) | boolean,
      decorations: Decoration[]
      ) =>
      new ReactNodeView<T>(
        node,
        view,
        getPos,
        decorations,
        portalProvider,
        component,
      )
  }
}
