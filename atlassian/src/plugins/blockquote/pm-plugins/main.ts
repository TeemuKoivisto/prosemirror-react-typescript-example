import { EditorState, Plugin, NodeSelection } from 'prosemirror-state';

import { blockQuoteNodeView } from '../nodeviews/BlockQuoteView';
import { CommandDispatch } from '../../../types';
import { pluginKey } from './plugin-factory';
// import { findCodeBlock } from '../utils';

import { PortalProviderAPI } from '../../../react-portals'
import { EventDispatcher, Dispatch } from '../../../utils/event-dispatcher';

import { BlockQuoteOptions } from '../'

export type BlockQuoteState = {
  count: number
};

export const getPluginState = (state: EditorState): BlockQuoteState =>
  pluginKey.getState(state);

export const setPluginState = (stateProps: Object) => (
  state: EditorState,
  dispatch: CommandDispatch,
): boolean => {
  const pluginState = getPluginState(state);
  dispatch(
    state.tr.setMeta(pluginKey, {
      ...pluginState,
      ...stateProps,
    }),
  );
  return true;
};

export type CodeBlockStateSubscriber = (state: BlockQuoteState) => any;

export function blockQuotePluginFactory(
  // dispatch: Dispatch,
  // providerFactory: ProviderFactory,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  options?: BlockQuoteOptions,
) {
  return new Plugin({
    state: {
      init(_, state): BlockQuoteState {
        return {
          count: 0
        };
      },
      apply(
        tr,
        pluginState: BlockQuoteState,
        _oldState,
        newState,
      ): BlockQuoteState {
        if (tr.docChanged || tr.selectionSet) {
          const { selection } = newState;

          // const node = findCodeBlock(newState, selection);
          const newPluginState: BlockQuoteState = {
            ...pluginState,
            count: pluginState.count + 1,
          };
          return newPluginState;
        }

        // const meta = tr.getMeta(pluginKey);
        // if (meta && meta.type === ACTIONS.SET_COPIED_TO_CLIPBOARD) {
        //   return {
        //     ...pluginState,
        //     contentCopied: meta.data,
        //   };
        // }

        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        blockquote: blockQuoteNodeView(portalProviderAPI, eventDispatcher, options),
      },
    },
  })
}
