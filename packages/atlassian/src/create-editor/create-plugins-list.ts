import { EditorProps } from '../Editor'
import { EditorPlugin } from '../types'
import { basePlugin, blockQuotePlugin, quickInsertPlugin, typeAheadPlugin } from '../plugins'

import { Preset } from './preset'

/**
 * Maps EditorProps to EditorPlugins
 */
export function createPluginsList(props: EditorProps, prevProps?: EditorProps): EditorPlugin[] {
  const preset = new Preset<EditorPlugin>()

  preset.add(basePlugin)

  preset.add(blockQuotePlugin)

  preset.add(quickInsertPlugin)

  preset.add(typeAheadPlugin)

  return preset.getEditorPlugins()
}
