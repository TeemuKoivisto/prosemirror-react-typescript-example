import { Command } from '../../../types';
import { pluginKey } from '../pm-plugins/plugin-key';
import { findTypeAheadQuery } from '../utils/find-query-mark';

export const dismissCommand = (): Command => (state, dispatch) => {
  const queryMark = findTypeAheadQuery(state);

  if (queryMark === null) {
    return false;
  }

  const { start, end } = queryMark;
  const { schema } = state;
  const markType = schema.marks.typeAheadQuery;
  if (start === -1) {
    return false;
  }

  const { typeAheadHandler } = pluginKey.getState(state);
  if (typeAheadHandler && typeAheadHandler.dismiss) {
    typeAheadHandler.dismiss(state);
  }

  if (dispatch) {
    dispatch(
      state.tr.removeMark(start, end, markType).removeStoredMark(markType),
    );
  }
  return true;
};
