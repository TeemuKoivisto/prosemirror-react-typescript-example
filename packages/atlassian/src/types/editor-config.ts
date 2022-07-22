import { ToolbarUIComponentFactory } from './editor-ui';

// TODO: Check if this circular dependency is still needed or is just legacy
// eslint-disable-next-line import/no-cycle
import { PMPlugin } from './pm-plugin';
import { MarkConfig, NodeConfig } from './pm-config';
import { UIComponentFactory } from './editor-ui';

export interface EditorConfig {
  nodes: NodeConfig[];
  marks: MarkConfig[];
  pmPlugins: Array<PMPlugin>;
  contentComponents: UIComponentFactory[];
  primaryToolbarComponents: ToolbarUIComponentFactory[];
}
