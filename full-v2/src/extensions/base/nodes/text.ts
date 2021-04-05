import { NodeSpec } from 'prosemirror-model'

export const text: NodeSpec & { toDebugString?: () => string } = {
  group: 'inline',
  toDebugString:
    process.env.NODE_ENV !== 'production' ? undefined : () => 'text_node',
};
