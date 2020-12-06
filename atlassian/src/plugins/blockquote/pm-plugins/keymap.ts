import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { bindKeymapWithCommand, toggleBlockQuote } from '../../../keymaps';
import { createNewBlockQuote } from '../commands'

export function keymapPlugin(): Plugin {
  const list = {};

  bindKeymapWithCommand(
    toggleBlockQuote.common!,
    createNewBlockQuote(),
    list,
  );

  return keymap(list);
}
