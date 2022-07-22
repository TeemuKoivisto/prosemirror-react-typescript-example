import { Plugin } from 'prosemirror-state'

import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import { createNewBlockQuote, createNewPmBlockQuote } from './actions'

export const plugins = () => {
  const plugins: Plugin[] = []

  plugins.push(history())
  plugins.push(keymap(baseKeymap))
  plugins.push(keymap({
    'Ctrl-Alt-b': createNewBlockQuote,
    'Ctrl-Alt-p': createNewPmBlockQuote,
  }))

  return plugins
}
