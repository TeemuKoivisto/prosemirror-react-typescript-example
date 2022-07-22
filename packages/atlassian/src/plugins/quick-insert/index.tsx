import React from 'react';
import { Plugin } from 'prosemirror-state';
import {
  QuickInsertItem,
  QuickInsertProvider,
  ProviderFactory,
} from '../../provider-factory';

import { Dispatch } from '../../utils/event-dispatcher'
import { EditorPlugin, Command } from '../../types';

import { pluginKey } from './plugin-key';
import { searchQuickInsertItems } from './search';
import {
  QuickInsertHandler,
  QuickInsertPluginOptions,
  QuickInsertPluginState,
} from './types';

// import ModalElementBrowser from './ui/ModalElementBrowser';

export type {
  QuickInsertHandler,
  QuickInsertPluginState,
  QuickInsertPluginOptions,
};
export { pluginKey };

export const quickInsertPlugin = (
  options?: QuickInsertPluginOptions,
): EditorPlugin => ({
  name: 'quickInsert',

  pmPlugins(quickInsert: Array<QuickInsertHandler>) {
    return [
      {
        name: 'quickInsert', // It's important that this plugin is above TypeAheadPlugin
        plugin: ({ providerFactory, dispatch }) =>
          quickInsertPluginFactory(
            quickInsert,
            providerFactory,
            dispatch,
          ),
      },
    ];
  },

  pluginsOptions: {
    typeAhead: {
      trigger: '/',
      headless: options ? options.headless : undefined,
      getItems: (
        query,
        state,
        _tr,
        dispatch,
      ) => {
        const quickInsertState: QuickInsertPluginState = pluginKey.getState(
          state,
        );
        return searchQuickInsertItems(quickInsertState, options)(query);
      },
      selectItem: (state, item, insert) => {
        return (item as QuickInsertItem).action(insert, state);
      },
    },
  },

  // contentComponent({ editorView }) {
  //   if (options && options.enableElementBrowser) {
  //     return <ModalElementBrowser editorView={editorView} />;
  //   }

  //   return null;
  // },
});

const itemsCache: Record<string, Array<QuickInsertItem>> = {};
export const processItems = (
  items: Array<QuickInsertHandler>,
) => {
  if (!itemsCache['en']) {
    itemsCache['en'] = items.reduce(
      (acc: Array<QuickInsertItem>, item: QuickInsertHandler) => {
        // if (typeof item === 'function') {
        //   return acc.concat(item('en'));
        // }
        return acc.concat(item);
      },
      [],
    );
  }
  return itemsCache['en'];
};

const setProviderState = (
  providerState: Partial<QuickInsertPluginState>,
): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, providerState));
  }
  return true;
};

function quickInsertPluginFactory(
  quickInsertItems: Array<QuickInsertHandler>,
  providerFactory: ProviderFactory,
  dispatch: Dispatch,
) {
  return new Plugin({
    key: pluginKey,
    state: {
      init(): QuickInsertPluginState {
        return {
          isElementBrowserModalOpen: false,
          // lazy so it doesn't run on editor initialization
          lazyDefaultItems: () => processItems(quickInsertItems || []),
        };
      },

      apply(tr, pluginState: any) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const changed = Object.keys(meta).some(key => {
            return pluginState[key] !== meta[key];
          });

          if (changed) {
            const newState = { ...pluginState, ...meta };

            dispatch(pluginKey, newState);
            return newState;
          }
        }

        return pluginState;
      },
    },

    view(editorView) {
      const providerHandler = async (
        _name: string,
        providerPromise?: Promise<QuickInsertProvider>,
      ) => {
        if (providerPromise) {
          try {
            const provider = await providerPromise;
            const providedItems = await provider.getItems();
            setProviderState({ provider, providedItems })(
              editorView.state,
              editorView.dispatch,
            );
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error getting items from quick insert provider', e);
          }
        }
      };
      providerFactory.subscribe('quickInsertProvider', providerHandler);

      return {
        destroy() {
          providerFactory.unsubscribe('quickInsertProvider', providerHandler);
        },
      };
    },
  });
}
