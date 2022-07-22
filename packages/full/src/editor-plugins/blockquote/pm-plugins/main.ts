import { EditorState, Plugin } from 'prosemirror-state';
import { PluginKey } from '../../../core/pm'

import { CommandDispatch } from '../../../core/types';

import { blockQuoteNodeView } from '../nodeviews/BlockQuoteView';
import { findBlockQuote } from '../pm-utils/findBlockQuote';

import { BlockQuoteOptions } from '../'
import { EditorContext } from '../../../core/EditorContext';

export interface BlockQuoteState {
  blockQuoteActive: boolean
  // blockQuoteDisabled: boolean
};

export const blockquotePluginKey = new PluginKey('blockQuotePlugin')

export const getPluginState = (state: EditorState): BlockQuoteState =>
  blockquotePluginKey.getState(state);

export const setPluginState = (stateProps: Object) => (
  state: EditorState,
  dispatch: CommandDispatch,
): boolean => {
  const pluginState = getPluginState(state);
  dispatch(
    state.tr.setMeta(blockquotePluginKey, {
      ...pluginState,
      ...stateProps,
    }),
  );
  return true;
};

export function blockQuotePluginFactory(
  ctx: EditorContext,
  options?: BlockQuoteOptions,
) {
  return new Plugin({
    state: {
      init(_, state): BlockQuoteState {
        return {
          blockQuoteActive: false,
          // blockQuoteDisabled: false,
        };
      },
      apply(
        tr,
        pluginState: BlockQuoteState,
        _oldState,
        newState,
      ): BlockQuoteState {
        if (tr.docChanged || tr.selectionSet) {
          const blockQuoteActive = !!findBlockQuote(newState, newState.selection)
          // const blockQuoteDisabled = !(
          //   blockQuoteActive ||
          //   isWrappingPossible(newState.schema.blockquote, newState)
          // )

          if (
            blockQuoteActive !== pluginState.blockQuoteActive
          ) {
            const nextPluginState = {
              ...pluginState,
              blockQuoteActive,
              // blockQuoteDisabled,
            };
            ctx.pluginsProvider.publish(blockquotePluginKey, nextPluginState);
            return nextPluginState;
          }
        }

        return pluginState;
      },
    },
    key: blockquotePluginKey,
    props: {
      nodeViews: {
        blockquote: blockQuoteNodeView(ctx, options),
      },
    },
  })
}
