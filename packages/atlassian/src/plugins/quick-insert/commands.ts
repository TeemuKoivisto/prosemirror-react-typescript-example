import { Fragment, Node } from 'prosemirror-model';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { QuickInsertItem } from '../../provider-factory';

import { insertSelectedItem } from '../../utils/insert';
import { Command } from '../../types';
import { pluginKey } from './plugin-key';

export const openElementBrowserModal = (): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, { isElementBrowserModalOpen: true }));
  }
  return true;
};

export const closeElementBrowserModal = (): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, { isElementBrowserModalOpen: false }));
  }
  return true;
};

// this method was adapted from the typeahed plugin so we respect the API for quick insert items
export const insertItem = (item: QuickInsertItem): Command => (
  state,
  dispatch,
) => {
  const insert = (
    maybeNode?: Node | Object | string | Fragment,
    opts: { selectInlineNode?: boolean } = {},
  ) => {
    return insertSelectedItem(maybeNode, opts)(
      state,
      state.tr,
      state.selection.head,
    );
  };

  const tr = item.action(insert, state);

  if (tr && dispatch) {
    dispatch(tr);
  }

  return true;
};
