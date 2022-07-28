import { Plugin, PluginKey } from 'prosemirror-state'
import { NodeSpec, MarkSpec } from 'prosemirror-model'

import { EditorContext } from '@context'

export interface IExtensionSchema {
  nodes?: { [key: string]: NodeSpec }
  marks?: { [key: string]: MarkSpec }
}
export type ExtensionPlugin = { name: string; plugin: () => Plugin }
export interface IExtension<T> {
  readonly name: string
  readonly schema?: IExtensionSchema
  readonly plugins: ExtensionPlugin[]
  onPropsChanged: (props: T) => void
  onDestroy: () => void
}
export interface IExtensionClass<T> {
  new (ctx: EditorContext, props: T): Extension<T>
  readonly pluginKey: PluginKey | null
}

export class Extension<T> implements IExtension<T> {
  ctx: EditorContext
  props: T

  constructor(ctx: EditorContext, props: T) {
    this.ctx = ctx
    this.props = props
  }

  get name() {
    return ''
  }

  // TODO ehh? used to subscribe to pluginsProvider but seemed a bit iffy
  // The problem is, the typing of static properties is driving me up the wall and it's quite flaky
  static get pluginKey(): PluginKey | null {
    return null
  }

  get plugins(): ExtensionPlugin[] {
    return []
  }

  onPropsChanged(props: T) {
    this.props = props
  }

  onDestroy() {}
}
