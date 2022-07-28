import { EditorState } from 'prosemirror-state'
import { Extension, IExtensionSchema } from '../Extension'

import { blockquote } from './nodes/blockquote'
import { blockQuotePluginFactory } from './pm-plugins/main'
import { blockquotePluginKey, getPluginState } from './pm-plugins/state'
import { keymapPlugin } from './pm-plugins/keymap'

export interface BlockQuoteExtensionProps {}
export const blockQuoteSchema: IExtensionSchema = {
  nodes: { blockquote: blockquote },
}
export class BlockQuoteExtension extends Extension<BlockQuoteExtensionProps> {
  get name() {
    return 'blockquote' as const
  }

  get schema() {
    return blockQuoteSchema
  }

  static get pluginKey() {
    return blockquotePluginKey
  }

  static getPluginState(state: EditorState) {
    return getPluginState(state)
  }

  get plugins() {
    return [
      {
        name: 'blockquote',
        plugin: () => blockQuotePluginFactory(this.ctx, this.props),
      },
      { name: 'blockquoteKeyMap', plugin: () => keymapPlugin() },
    ]
  }
}
