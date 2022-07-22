import { PMPlugin } from './pm-plugin';
import { MarkConfig, NodeConfig } from './editor-config';

export interface PluginsOptions {
  [pluginName: string]: any;
  // blockQuote?: BlockQuoteHandler;
};

export interface EditorPlugin {
  /**
   * Name of a plugin, that other plugins can use to provide options to it or exclude via a preset.
   */
  name: string

  /**
   * Options that will be passed to a plugin with a corresponding name if it exists and enabled.
   */
  pluginsOptions?: any

  /**
   * List of ProseMirror-plugins. This is where we define which plugins will be added to EditorView (main-plugin, keybindings, input-rules, etc.).
   */
  pmPlugins?: (pluginOptions?: any) => PMPlugin[]

  /**
   * List of Nodes to add to the schema.
   */
  nodes?: () => NodeConfig[]

  /**
   * List of Marks to add to the schema.
   */
  marks?: () => MarkConfig[]
}
