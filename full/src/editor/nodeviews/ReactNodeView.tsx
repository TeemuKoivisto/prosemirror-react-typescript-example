import * as React from 'react'
import { NodeView, EditorView, Decoration } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'
import { PortalProviderAPI } from '../utils/PortalProvider'

export type getPosHandler = () => number
export type ReactComponentProps = { [key: string]: any }

// Source https://bitbucket.org/atlassian/atlaskit-mk-2/src/0fcae893b790443a30f7dadae00638d6e4238b2f/packages/editor/editor-core/src/nodeviews/ReactNodeView.tsx?at=master
export default class ReactNodeView implements NodeView {
  private domRef?: HTMLElement
  private contentDOMWrapper: Node | null = null
  private reactComponent?: React.ComponentType<any>
  private portalProviderAPI: PortalProviderAPI
  private hasContext: boolean

  reactComponentProps: ReactComponentProps = {}

  view: EditorView
  getPos: getPosHandler
  contentDOM: Node | undefined
  node: PMNode

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    portalProviderAPI: PortalProviderAPI,
    reactComponentProps: ReactComponentProps = {},
    reactComponent?: React.ComponentType<any>,
    hasContext: boolean = false,
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.portalProviderAPI = portalProviderAPI
    this.reactComponentProps = reactComponentProps
    this.reactComponent = reactComponent
    this.hasContext = hasContext
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
    this.domRef = this.createDomRef()
    this.setDomAttrs(this.node, this.domRef)

    const { dom: contentDOMWrapper, contentDOM } = this.getContentDOM() || {
      dom: undefined,
      contentDOM: undefined,
    }

    if (this.domRef && contentDOMWrapper) {
      this.domRef.appendChild(contentDOMWrapper)
      this.contentDOM = contentDOM ? contentDOM : contentDOMWrapper
      this.contentDOMWrapper = contentDOMWrapper || contentDOM
    }

    // @see ED-3790
    // something gets messed up during mutation processing inside of a
    // nodeView if DOM structure has nested plain "div"s, it doesn't see the
    // difference between them and it kills the nodeView
    this.domRef.className = `${this.node.type.name}View-content-wrap`

    this.renderReactComponent(() =>
      this.render(this.reactComponentProps, this.handleRef),
    )

    return this
  }

  private renderReactComponent(
    component: () => React.ReactElement<any> | null,
  ) {
    if (!this.domRef || !component) {
      return
    }

    this.portalProviderAPI.render(component, this.domRef!, this.hasContext)
  }

  createDomRef(): HTMLElement {
    return this.node.isInline
      ? document.createElement('span')
      : document.createElement('div')
  }

  getContentDOM():
    | { dom: Node; contentDOM?: Node | null | undefined }
    | undefined {
    return undefined
  }

  handleRef = (node: HTMLElement | undefined) => this._handleRef(node)

  private _handleRef(node: HTMLElement | undefined) {
    const contentDOM = this.contentDOMWrapper || this.contentDOM

    // move the contentDOM node inside the inner reference after rendering
    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM)
    }
  }

  render(
    props: ReactComponentProps,
    forwardRef?: (node: HTMLElement) => void,
  ): React.ReactElement<any> | null {
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

  update(
    node: PMNode,
    decorations: Array<Decoration>,
    validUpdate: (currentNode: PMNode, newNode: PMNode) => boolean = () => true,
  ) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate =
      this.node.type === node.type && validUpdate(this.node, node)

    if (!isValidUpdate) {
      return false
    }

    if (this.domRef && !this.node.sameMarkup(node)) {
      this.setDomAttrs(node, this.domRef)
    }

    this.node = node

    this.renderReactComponent(() =>
      this.render(this.reactComponentProps, this.handleRef),
    )

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

  get dom() {
    return this.domRef
  }

  destroy() {
    if (!this.domRef) {
      return
    }

    this.portalProviderAPI.remove(this.domRef)
    this.domRef = undefined
    this.contentDOM = undefined
  }

  static fromComponent(
    component: React.ComponentType<any>,
    portalProviderAPI: PortalProviderAPI,
    props?: ReactComponentProps,
  ) {
    return (node: PMNode, view: EditorView, getPos: getPosHandler) =>
      new ReactNodeView(
        node,
        view,
        getPos,
        portalProviderAPI,
        props,
        component,
      ).init()
  }
}
