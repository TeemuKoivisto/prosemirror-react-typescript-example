import { Node as PMNode } from 'prosemirror-model'
import { Decoration, DecorationSource, EditorView, NodeView } from 'prosemirror-view'

import type { EditorContext } from './context'

export class BaseNodeView<P extends any = {}> implements NodeView {
  protected _dom?: HTMLElement
  contentDOM?: HTMLElement

  node: PMNode
  ctx: EditorContext
  props?: P
  component?: React.ComponentType<any>

  constructor(
    node: PMNode,
    readonly view: EditorView,
    readonly getPos: () => number,
    _decorations: readonly Decoration[],
    _innerDecorations: DecorationSource,
    ctx: EditorContext,
    readonly _props?: P,
    component?: React.ComponentType<any>
  ) {
    this.node = node
    this.ctx = ctx
    this.props = _props
    this.component = component
    this.init()
  }

  get dom() {
    if (!this._dom) {
      throw Error(
        'Accessing uninitialized dom inside BaseNodeView! Did you forget to add initialize method?'
      )
    }
    return this._dom
  }

  /**
   * Override this
   */
  init = (): this => {
    return this
  }
  /**
   * Override this
   */
  updateContents = (): void => {}

  update = (
    newNode: PMNode,
    _decorations: readonly Decoration[],
    _innerDecorations: DecorationSource
  ): boolean => {
    // if (!newNode.sameMarkup(this.node)) return false
    if (newNode.attrs.id !== this.node.attrs.id) {
      return false
    }
    if (newNode.type.name !== this.node.type.name) {
      return false
    }
    this.node = newNode
    this.updateContents()
    // this.props.popper.update()
    return true
  }

  setDomAttrs(node: PMNode, element: HTMLElement, omit: string[] = []) {
    Object.keys(node.attrs || {}).forEach((attr) => {
      if (!omit.includes(attr)) {
        element.setAttribute(attr, node.attrs[attr])
      }
    })
  }

  selectNode = () => {
    this.dom.classList.add('ProseMirror-selectednode')
  }

  deselectNode = () => {
    this.dom.classList.remove('ProseMirror-selectednode')
    // this.props.popper.destroy()
  }

  destroy = () => {
    // this.props.popper.destroy()
  }

  static fromComponent<P>(ctx: EditorContext, props?: P, component?: React.ComponentType<any>) {
    return (
      node: PMNode,
      view: EditorView,
      getPos: () => number,
      decorations: readonly Decoration[],
      innerDecorations: DecorationSource
    ) =>
      new BaseNodeView(
        node,
        view,
        getPos,
        decorations,
        innerDecorations,
        ctx,
        props,
        component
      ).init()
  }
}
