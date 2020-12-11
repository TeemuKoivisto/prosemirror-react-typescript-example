import React from 'react'
import { EditorState } from 'prosemirror-state'

import { blockquote } from '../../schema/nodes'
import { blockQuotePluginFactory } from './pm-plugins/main';
// import { getToolbarConfig } from './toolbar';
import { keymapPlugin } from './pm-plugins/keymap'
import * as keymaps from '../../keymaps';

import { QuickInsertActionInsert } from '../../provider-factory/quick-insert-provider'
import IconQuote from '../quick-insert/assets/code';

import { EditorPlugin, PMPluginFactory } from '../../types';

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
          // providerFactory,
          // dispatch,
          portalProviderAPI,
          eventDispatcher,
        }) =>
          blockQuotePluginFactory(
            // dispatch,
            // providerFactory,
            portalProviderAPI,
            eventDispatcher,
            options,
          ),
      },
      { name: 'blockquoteKeyMap', plugin: () => keymapPlugin() },
    ]
    return plugins
  },

  pluginsOptions: {
    quickInsert: [
      {
        id: 'blockquote',
        title: 'Quote',
        description: 'Quote some text',
        priority: 1300,
        keyshortcut: keymaps.tooltip(keymaps.toggleBlockQuote),
        icon: () => <IconQuote label={'Quote'} />,
        action(insert: QuickInsertActionInsert, state: EditorState<any>) {
          const tr = insert(
            state.schema.nodes.blockquote.createChecked(
              {},
              state.schema.nodes.paragraph.createChecked(),
            ),
          );
          return tr
        },
      },
    ],
    // floatingToolbar: getToolbarConfig(options.allowCopyToClipboard),
  },
});
