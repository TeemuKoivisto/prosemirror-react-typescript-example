import { MarkSpec, NodeSpec } from 'prosemirror-model';
import { NodeView } from 'prosemirror-view';

export interface NodeConfig {
  name: string;
  node: NodeSpec;
}

export interface MarkConfig {
  name: string;
  mark: MarkSpec;
}

export interface NodeViewConfig {
  name: string;
  nodeView: NodeView;
}
