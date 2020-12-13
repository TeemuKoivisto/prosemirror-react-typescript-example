import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { bindKeymapWithCommand, toggleBlockQuote } from '../../../core/keymaps';
import { createNewBlockQuote } from '../commands'

export function keymapPlugin(): Plugin {
  const keymapObj = {};

  bindKeymapWithCommand(
    toggleBlockQuote.common!,
    createNewBlockQuote(),
    keymapObj,
  );

  return keymap(keymapObj);
}
