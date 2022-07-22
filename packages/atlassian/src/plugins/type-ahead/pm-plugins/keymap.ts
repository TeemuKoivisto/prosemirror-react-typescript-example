import { keymap } from 'prosemirror-keymap';
import { EditorState, Plugin } from 'prosemirror-state';

import * as keymaps from '../../../keymaps';
import { dismissCommand } from '../commands/dismiss';
import {
  selectCurrentItem,
  selectSingleItemOrDismiss,
} from '../commands/select-item';

import { ACTIONS, pluginKey } from './main';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      return selectCurrentItem('enter')(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      if (dispatch) {
        dispatch(state.tr.setMeta(pluginKey, { action: ACTIONS.SELECT_PREV }));
      }
      return true;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      if (dispatch) {
        dispatch(state.tr.setMeta(pluginKey, { action: ACTIONS.SELECT_NEXT }));
      }
      return true;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      return selectCurrentItem('shift-enter')(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.tab.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      return selectCurrentItem('tab')(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }

      /**
       * Jira uses escape to toggle the collapsed editor
       * stop the event propagation when the picker is open
       */
      if (window.event) {
        window.event.stopPropagation();
      }

      return dismissCommand()(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.space.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (pluginState && pluginState.active) {
        return selectSingleItemOrDismiss('space')(state, dispatch);
      }
      return false;
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
