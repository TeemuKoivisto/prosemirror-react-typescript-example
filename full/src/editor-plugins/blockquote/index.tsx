import React from 'react'
import { EditorState } from 'prosemirror-state'

import { blockquote } from '../../schema/nodes'
import { blockQuotePluginFactory, blockquotePluginKey } from './pm-plugins/main';
import { keymapPlugin } from './pm-plugins/keymap'
import * as keymaps from '../../core/keymaps';

import { EditorPlugin, PMPluginFactory } from '../../core/types';

export interface BlockQuoteOptions {
}

export const blockQuotePlugin = (options: BlockQuoteOptions = {}): EditorPlugin => ({
  name: 'blockquote',

  nodes() {
    return [{ name: 'blockquote', node: blockquote }];
  },

  pmPlugins() {
    const plugins: { name: string; plugin: PMPluginFactory }[] = [
      {
        name: 'blockquote',
        plugin: ({
          portalProvider,
          editorPlugins,
        }) =>
          blockQuotePluginFactory(
            portalProvider,
            editorPlugins,
            options,
          ),
      },
      { name: 'blockquoteKeyMap', plugin: () => keymapPlugin() },
    ]
    return plugins
  },

  pluginsOptions: {
  },
});
