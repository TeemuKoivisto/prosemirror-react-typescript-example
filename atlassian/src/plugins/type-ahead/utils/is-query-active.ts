import { MarkType, Node } from 'prosemirror-model';

export function isQueryActive(
  mark: MarkType,
  doc: Node,
  from: number,
  to: number,
) {
  let active = false;

  doc.nodesBetween(from, to, node => {
    if (!active && mark.isInSet(node.marks)) {
      active = true;
    }
  });

  return active;
}
