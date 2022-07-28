import { EditorState } from 'prosemirror-state'
import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import { Extension, IExtensionSchema } from '../Extension'

import { doc, paragraph, text } from './nodes'
import { em, strong } from './marks'

import { basePluginFactory } from './pm-plugins/main'
import { basePluginKey, getPluginState, BaseState } from './pm-plugins/state'

export interface BaseExtensionProps {}
export const baseSchema: IExtensionSchema = {
  nodes: { doc, paragraph, text },
  marks: { em, strong },
}
export class BaseExtension extends Extension<BaseExtensionProps> {
  get name() {
    return 'base'
  }

  get schema() {
    return baseSchema
  }

  static get pluginKey() {
    return basePluginKey
  }

  static getPluginState(state: EditorState) {
    return getPluginState(state)
  }

  subscribe(fn: (newState: BaseState) => void) {
    this.ctx.pluginsProvider.subscribe(basePluginKey, fn)
  }

  unsubscribe(fn: (newState: BaseState) => void) {
    this.ctx.pluginsProvider.unsubscribe(basePluginKey, fn)
  }

  get plugins() {
    return [
      { name: 'history', plugin: () => history() },
      { name: 'baseKeyMap', plugin: () => keymap(baseKeymap) },
      { name: 'base', plugin: () => basePluginFactory(this.ctx, this.props) },
    ]
  }
}
