import { TextSelection } from 'prosemirror-state';
import { safeInsert } from 'prosemirror-utils';

import { Command } from '../../../types';

export function insertTypeAheadQuery(
  trigger: string,
  replaceLastChar = false,
): Command {
  return (state, dispatch) => {
    if (!dispatch) {
      return false;
    }

    if (replaceLastChar) {
      const { tr, selection } = state;
      const marks = selection.$from.marks();

      dispatch(
        tr
          .setSelection(
            TextSelection.create(
              tr.doc,
              selection.$from.pos - 1,
              selection.$from.pos,
            ),
          )
          .replaceSelectionWith(
            state.doc.type.schema.text(trigger, [
              state.schema.marks.typeAheadQuery.create({ trigger }),
              ...marks,
            ]),
            false,
          ),
      );
      return true;
    }

    dispatch(
      safeInsert(
        state.schema.text(trigger, [
          state.schema.marks.typeAheadQuery.create({ trigger }),
        ]),
      )(state.tr),
    );

    return true;
  };
}
