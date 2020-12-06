import { blockquote } from '../../schema/nodes'
import { blockQuotePluginFactory } from './pm-plugins/main';
// import { getToolbarConfig } from './toolbar';
import { keymapPlugin } from './pm-plugins/keymap'

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
    // quickInsert: ({ formatMessage }) => [
    //   {
        // id: 'blockquote',
        // title: formatMessage(messages.blockquote),
        // description: formatMessage(messages.codeblockDescription),
        // keywords: ['code block'],
        // priority: 700,
        // keyshortcut: '```',
        // icon: () => <IconCode label={formatMessage(messages.blockquote)} />,
        // action(insert, state) {
        //   const schema = state.schema;
        //   const tr = insert(schema.nodes.blockquote.createChecked());
        //   return addAnalytics(state, tr, {
        //     action: ACTION.INSERTED,
        //     actionSubject: ACTION_SUBJECT.DOCUMENT,
        //     actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
        //     attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
        //     eventType: EVENT_TYPE.TRACK,
        //   });
        // },
    //   },
    // ],
    // floatingToolbar: getToolbarConfig(options.allowCopyToClipboard),
  },
});
