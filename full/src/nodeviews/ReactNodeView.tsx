import React from 'react'
import { NodeView, EditorView, Decoration } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

import { PortalProvider } from '../react-portals'

export type ReactComponentProps = { [key: string]: unknown }
export type ForwardRef = (node: HTMLElement | null) => void
export type shouldUpdate = (nextNode: PMNode) => boolean

export class ReactNodeView<P = ReactComponentProps> implements NodeView {
  private domRef?: HTMLElement
  private contentDOMWrapper?: Node
  private reactComponent?: React.ComponentType<any>
  private portalProvider: PortalProvider
  private _viewShouldUpdate?: shouldUpdate

  reactComponentProps: P

  view: EditorView
  getPos: (() => number) | boolean
  contentDOM: Node | undefined
  node: PMNode

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: (() => number) | boolean,
    portalProvider: PortalProvider,
    reactComponentProps?: P,
    reactComponent?: React.ComponentType<any>,
    viewShouldUpdate?: shouldUpdate,
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.portalProvider = portalProvider
    this.reactComponentProps = reactComponentProps || ({} as P)
    this.reactComponent = reactComponent
    this._viewShouldUpdate = viewShouldUpdate
  }

  get dom() {
    return this.domRef
  }

  /**
   * This method exists to move initialization logic out of the constructor,
   * so object can be initialized properly before calling render first time.
   *
   * Example:
   * Instance properties get added to an object only after super call in
   * constructor, which leads to some methods being undefined during the
   * first render.
   */
  init() {
    // Here, we'll provide a container to render React into.
    // Coincidentally, this is where ProseMirror will put its
    // generated contentDOM.  React will throw out that content
    // once rendered, and at the same time we'll append it into
    // the component tree, like a fancy shell game.  This isn't
    // obvious to the user, but would it be more obvious on an
    // expensive render?
    //
    this.domRef = this.createDOM()
    this.setDomAttrs(this.node, this.domRef)

    // @see ED-3790
    // something gets messed up during mutation processing inside of a
    // nodeView if DOM structure has nested plain "div"s, it doesn't see the
    // difference between them and it kills the nodeView
    this.domRef.classList.add(`${this.node.type.name}__nodeview-dom`)

    // Finally, we provide an element to render content into.
    // We will be moving this node around as we need to.
    const { wrapper: contentDOMWrapper, contentDOM } = this.createContentDOM() ?? {}

    if (contentDOMWrapper) {
      this.domRef.appendChild(contentDOMWrapper)
      this.contentDOM = contentDOM ?? contentDOMWrapper
      this.contentDOMWrapper = contentDOMWrapper
    }

    this.renderReactComponent(this.render(this.reactComponentProps, this.handleRef))

    return this
  }

  private renderReactComponent(component: React.ReactElement<any> | null) {
    if (!this.domRef || !component) {
      return
    }
    this.portalProvider.render(component, this.domRef!)
  }

  createDOM(): HTMLElement {
    return this.node.isInline ? document.createElement('span') : document.createElement('div')
  }

  createContentDOM(): { wrapper: Node, contentDOM?: Node | null } | undefined {
    return undefined
  }

  handleRef = (node: HTMLElement | null) => this._handleRef(node)

  private _handleRef(node: HTMLElement | null) {
    const contentDOM = this.contentDOMWrapper || this.contentDOM

    // move the contentDOM node inside the inner reference after rendering
    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM)
    }
  }

  render(props: P, forwardRef?: ForwardRef): React.ReactElement<any> | null {
    return this.reactComponent ? (
      <this.reactComponent
        view={this.view}
        getPos={this.getPos}
        node={this.node}
        forwardRef={forwardRef}
        {...props}
      />
    ) : null
  }

  update(node: PMNode, _decorations: Decoration[]) {
    if (this.domRef && !this.node.sameMarkup(node)) {
      this.setDomAttrs(node, this.domRef)
    }

    this.node = node
    // View should not process a re-render if this is false.
    // We dont want to destroy the view, so we return true.
    if (!this.viewShouldUpdate(node)) {
      return true
    }

    this.renderReactComponent(
      this.render(this.reactComponentProps, this.handleRef)
    )

    return true
  }

  viewShouldUpdate(nextNode: PMNode): boolean {
    if (this._viewShouldUpdate) {
      return this._viewShouldUpdate(nextNode)
    }
    return true
  }

  /**
   * Copies the attributes from a ProseMirror Node to a DOM node.
   * @param node The Prosemirror Node from which to source the attributes
   */
  setDomAttrs(node: PMNode, element: HTMLElement) {
    Object.keys(node.attrs || {}).forEach(attr => {
      element.setAttribute(attr, node.attrs[attr])
    })
  }

  destroy() {
    if (!this.domRef) {
      return
    }
    this.portalProvider.remove(this.domRef)
    this.domRef = undefined
    this.contentDOM = undefined
  }

  static fromComponent(
    component: React.ComponentType<any>,
    portalProvider: PortalProvider,
    props?: ReactComponentProps,
    viewShouldUpdate?: (nextNode: PMNode) => boolean,
  ) {
    return (node: PMNode, view: EditorView, getPos: (() => number) | boolean) =>
      new ReactNodeView(
        node,
        view,
        getPos,
        portalProvider,
        props,
        component,
        viewShouldUpdate,
      ).init()
  }
}
