import { Fragment, Node } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

import { Command } from '../../../types'

import { insertSelectedItem } from '../../../utils/insert'
import { ACTIONS } from '../pm-plugins/actions'
import { pluginKey } from '../pm-plugins/plugin-key'
import { SelectItemMode, TypeAheadHandler, TypeAheadItem } from '../types'
import { findTypeAheadQuery } from '../utils/find-query-mark'
// import { isInviteItem } from '../../mentions/utils';

import { dismissCommand } from './dismiss'

export const selectCurrentItem =
  (mode: SelectItemMode = 'selected'): Command =>
  (state, dispatch) => {
    const { active, currentIndex, items, typeAheadHandler } = pluginKey.getState(state)

    if (!active || !typeAheadHandler) {
      return false
    }

    if (!typeAheadHandler.selectItem || !items[currentIndex]) {
      return withTypeAheadQueryMarkPosition(state, (start, end) =>
        insertFallbackCommand(start, end)(state, dispatch)
      )
    }

    return selectItem(typeAheadHandler, items[currentIndex], mode)(state, dispatch)
  }

export const selectSingleItemOrDismiss =
  (mode: SelectItemMode = 'selected'): Command =>
  (state, dispatch) => {
    const { active, items, typeAheadHandler } = pluginKey.getState(state)

    if (!active || !typeAheadHandler || !typeAheadHandler.selectItem) {
      return false
    }

    if (items.length === 1) {
      return selectItem(typeAheadHandler, items[0], mode)(state, dispatch)
    }

    if (!items || items.length === 0) {
      dismissCommand()(state, dispatch)
      return false
    }

    return false
  }

export const selectByIndex =
  (index: number): Command =>
  (state, dispatch) => {
    const { active, items, typeAheadHandler } = pluginKey.getState(state)

    if (!active || !typeAheadHandler || !typeAheadHandler.selectItem || !items[index]) {
      return false
    }

    return selectItem(typeAheadHandler, items[index])(state, dispatch)
  }

export const selectItem =
  (handler: TypeAheadHandler, item: TypeAheadItem, mode: SelectItemMode = 'selected'): Command =>
  (state, dispatch) => {
    return withTypeAheadQueryMarkPosition(state, (start, end) => {
      const insert = (
        maybeNode?: Node | Object | string | Fragment,
        opts: { selectInlineNode?: boolean } = {}
      ) => {
        let tr = state.tr

        tr = tr
          .setMeta(pluginKey, { action: ACTIONS.SELECT_CURRENT })
          .replaceWith(start, end, Fragment.empty)

        return insertSelectedItem(maybeNode, opts)(state, tr, start)
      }

      const tr = handler.selectItem(state, item, insert, { mode })

      // if this is the invite teammates item, delete the trigger and query
      // if (isInviteItem(item.mention)) {
      //   // allow the user the select the invite item by left click or enter, but not by space bar
      //   if (mode !== 'space') {
      //     if (dispatch) {
      //       dispatch(state.tr.delete(start, end));
      //       return true;
      //     }
      //   }

      //   return false;
      // }

      if (tr === false) {
        return insertFallbackCommand(start, end)(state, dispatch)
      }

      if (dispatch) {
        dispatch(tr)
      }
      return true
    })
  }

export const insertFallbackCommand =
  (start: number, end: number): Command =>
  (state, dispatch) => {
    const { query, trigger } = pluginKey.getState(state)
    const node = state.schema.text(trigger + query)

    if (dispatch) {
      dispatch(state.tr.replaceWith(start, end, node))
    }
    return true
  }

export const withTypeAheadQueryMarkPosition = (
  state: EditorState,
  cb: (start: number, end: number) => boolean
) => {
  const queryMark = findTypeAheadQuery(state)

  if (!queryMark || queryMark.start === -1) {
    return false
  }

  return cb(queryMark.start, queryMark.end)
}
