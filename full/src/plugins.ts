import { Plugin } from 'prosemirror-state'

import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import {
  createNewUnderline, createNewBlockQuote, createNewPmBlockQuote,
  createParagraphNear, splitBlock
} from './actions'

export const plugins = () => {
  const plugins: Plugin[] = []

  plugins.push(history())
  plugins.push(keymap(baseKeymap))
  plugins.push(keymap({
    'Ctrl-n': createNewUnderline,
    'Ctrl-b': createNewBlockQuote,
    'Ctrl-p': createNewPmBlockQuote,
    'Ctrl-s': splitBlock,
  }))

  return plugins
}
