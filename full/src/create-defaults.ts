import { EditorProps } from './Editor'
import { EditorPlugin } from './core/types'
import {
  basePlugin,
  blockQuotePlugin,
} from './editor-plugins'

import { Preset } from './core/create/preset'

export function createDefaultEditorPlugins(props: EditorProps, prevProps?: EditorProps): EditorPlugin[] {
  const preset = new Preset<EditorPlugin>()

  preset.add(basePlugin)

  preset.add(blockQuotePlugin)

  return preset.getEditorPlugins()
}
