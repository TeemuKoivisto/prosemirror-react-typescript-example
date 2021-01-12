import { Plugin } from 'prosemirror-state'

import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import { createNewUnderline } from './actions'

export const plugins = () => {
  const plugins: Plugin[] = []

  plugins.push(history())
  plugins.push(keymap(baseKeymap))
  plugins.push(keymap({
    'Ctrl-Alt-u': createNewUnderline,
  }))

  return plugins
}
