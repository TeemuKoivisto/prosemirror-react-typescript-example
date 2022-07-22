import { EditorState, Plugin } from 'prosemirror-state'
import { PluginKey } from '@core'
import { CommandDispatch } from '@core'

export interface BlockQuoteState {
  blockQuoteActive: boolean
  // blockQuoteDisabled: boolean
}

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
