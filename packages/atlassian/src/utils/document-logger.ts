import { Node as PMNode, Fragment } from 'prosemirror-model';

export type SimplifiedNode = {
  type: string;
  pos: number;
  nodeSize: number;
  marks?: string[];
  content?: SimplifiedNode[];
};

export const getDocStructure = (doc: PMNode): SimplifiedNode | string => {
  try {
    return getBlockNode(doc, 0);
  } catch (error) {
    return `Error logging document structure: ${error}`;
  }
};

const getBlockNode = (node: PMNode, pos: number): SimplifiedNode => {
  const blockNode: SimplifiedNode = {
    type: node.type.name,
    pos,
    nodeSize: node.nodeSize,
  };
  const content = getBlockNodeContent(node.content, pos);
  if (content.length > 0) {
    blockNode.content = content;
  }
  const marks = getMarks(node);
  if (marks.length > 0) {
    blockNode.marks = marks;
  }

  return blockNode;
};

const getBlockNodeContent = (
  node: Fragment & { content?: PMNode[] },
  pos: number,
): SimplifiedNode[] => {
  if (!node || !node.content || !node.content.length) {
    return [];
  }

  let blockNodeContent: SimplifiedNode[] = [];
  const { content } = node;
  if (content[0].isBlock) {
    // children are block nodes
    let prevNode: PMNode;
    blockNodeContent = content.map(node => {
      pos += prevNode ? prevNode.nodeSize : 1;
      prevNode = node;
      return getBlockNode(node, pos);
    });
  } else {
    // children are inline nodes
    const result = getInlineNodes(content, pos);
    blockNodeContent = result.inlineNodes;
    pos = result.pos;
  }

  return blockNodeContent;
};

const getInlineNodes = (
  nodes: PMNode[],
  pos: number,
): { inlineNodes: SimplifiedNode[]; pos: number } => {
  let inlineNodes: SimplifiedNode[] = nodes.map(node => {
    const { nodeSize } = node;
    const inlineNode: SimplifiedNode = {
      type: node.type.name,
      pos,
      nodeSize,
    };
    const marks = getMarks(node);
    if (marks.length > 0) {
      inlineNode.marks = marks;
    }
    pos += nodeSize;
    return inlineNode;
  });

  return { inlineNodes, pos };
};

const getMarks = (node: PMNode): string[] =>
  node.marks.map(mark => mark.type.name);
