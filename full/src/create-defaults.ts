import { EditorProps } from './Editor'
import { EditorPlugin } from './core/types'
import {
  basePlugin,
  blockQuotePlugin,
} from './editor-plugins'

import { Preset } from './core/create/preset'
import { createSchema } from './core/create/create-schema'
import { processPluginsList } from './core/create/create-plugins'

export function createDefaultEditorPlugins(props: EditorProps, prevProps?: EditorProps): EditorPlugin[] {
  const preset = new Preset<EditorPlugin>()

  preset.add(basePlugin)

  preset.add(blockQuotePlugin)

  return preset.getEditorPlugins()
}

export function createDefaultSchema() {
  const editorProps: EditorProps = {}
  const editorPlugins = createDefaultEditorPlugins(editorProps)
  const config = processPluginsList(editorPlugins)
  const schema = createSchema(config)
  return schema
}
