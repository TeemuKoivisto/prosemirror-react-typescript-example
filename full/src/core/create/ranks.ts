const ranks = {
  plugins: [
    'underline',
    'blockquote',
    'quickInsert',
    'typeAhead',
  ],
  nodes: [
    'doc',
    'paragraph',
    'text',
    'bulletList',
    'orderedList',
    'listItem',
    'heading',
    'blockquote',
    'pmBlockquote',
    'codeBlock',
  ],
  marks: [
    // Inline marks
    'link',
    'em',
    'strong',
    'textColor',
    'strike',
    'subsup',
    'underline',
    'code',
    'typeAheadQuery',

    // Block marks
    'alignment',
    'breakout',
    'indentation',
    'annotation',

    //Unsupported mark
    'unsupportedMark',
    'unsupportedNodeAttribute',
  ],
}

export function sortByOrder(item: 'plugins' | 'nodes' | 'marks') {
  return function (a: { name: string }, b: { name: string }): number {
    return ranks[item].indexOf(a.name) - ranks[item].indexOf(b.name);
  };
}
