import { ToolbarUIComponentFactory } from './editor-ui'
import { PMPlugin } from './pm-plugin'
import { MarkConfig, NodeConfig } from './pm-config'

import { QuickInsertHandler } from '../plugins/quick-insert/types'
import { TypeAheadHandler } from '../plugins/type-ahead/types'

import { UIComponentFactory } from './editor-ui'

export type PluginsOptions = {
  [pluginName: string]: any
  quickInsert?: QuickInsertHandler
  typeAhead?: TypeAheadHandler
}

export interface EditorPlugin {
  /**
   * Name of a plugin, that other plugins can use to provide options to it or exclude via a preset.
   */
  name: string

  /**
   * Options that will be passed to a plugin with a corresponding name if it exists and enabled.
   */
  pluginsOptions?: PluginsOptions

  /**
   * List of ProseMirror-plugins. This is where we define which plugins will be added to EditorView (main-plugin, keybindings, input-rules, etc.).
   */
  pmPlugins?: (pluginOptions?: any) => Array<PMPlugin>

  /**
   * List of Nodes to add to the schema.
   */
  nodes?: () => NodeConfig[]

  /**
   * List of Marks to add to the schema.
   */
  marks?: () => MarkConfig[]

  /**
   * Optional UI-component that lives inside the actual content-area (like mention-picker, floating toolbar for links, etc.)
   */
  contentComponent?: UIComponentFactory

  /**
   * Optional UI-component that will be added to the toolbar at the top of the editor (doesn't exist in the compact-editor).
   */
  primaryToolbarComponent?: ToolbarUIComponentFactory

  /**
   * Optional UI-component that will be added to the toolbar at the bottom right of the editor. (doesn't exist in the full-page editor)
   * In compact mode this toolbar lives on the right-hand side of the editor.
   */
  // secondaryToolbarComponent?: UIComponentFactory;
}
