import { Plugin } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Dispatch } from '../../event-dispatcher';
import { initialize } from './events/initialize';
import { PrivateCollabEditOptions, ProviderCallback } from './types';
import { CollabEditProvider } from './provider';
import { PluginState } from './plugin-state';
import { pluginKey } from './plugin-key';
import { addSynchronyErrorAnalytics } from './analytics';

export { PluginState, pluginKey };
export type { CollabEditProvider };

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  collabProviderCallback: ProviderCallback,
  options: PrivateCollabEditOptions,
) => {
  return new Plugin({
    key: pluginKey,
    state: {
      init(config) {
        return PluginState.init(config);
      },
      apply(
        transaction,
        prevPluginState: PluginState,
        oldEditorState,
        newEditorState,
      ) {
        const pluginState = prevPluginState.apply(transaction);
        dispatch(pluginKey, pluginState);
        return pluginState;
      },
    },
    props: {
      decorations(this: Plugin, state) {
        return this.getState(state).decorations;
      },
    },
    filterTransaction(tr, state) {
      const pluginState = pluginKey.getState(state);
      const collabInitialiseTr = tr.getMeta('collabInitialised');

      // Don't allow transactions that modifies the document before
      // collab-plugin is ready.
      if (collabInitialiseTr) {
        return true;
      }

      if (!pluginState.isReady && tr.docChanged) {
        return false;
      }

      return true;
    },
    view(view) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(
        view.state,
        view.state.tr,
      );

      const cleanup = collabProviderCallback(
        initialize({ view, options, providerFactory }),
        addErrorAnalytics,
      );

      return {
        destroy() {
          providerFactory.unsubscribeAll('collabEditProvider');
          if (cleanup) {
            cleanup.then(unsubscribe => {
              if (unsubscribe) {
                unsubscribe();
              }
            });
          }
        },
      };
    },
  });
};
