import React, { useCallback } from 'react';
import { EditorView } from 'prosemirror-view';

import WithPluginState from '../../../../ui/hocs/WithPluginState';
import { pluginKey } from '../../plugin-key';
import { QuickInsertPluginState } from '../../types';
import { searchQuickInsertItems } from '../../search';

import ModalElementBrowser from '../../../../ui/ElementBrowser/ModalElementBrowser';

import { closeElementBrowserModal, insertItem } from '../../commands';

type Props = {
  editorView: EditorView;
};

const Modal = ({
  quickInsertState,
  editorView,
}: {
  editorView: EditorView;
  quickInsertState: QuickInsertPluginState;
}) => {
  const getItems = useCallback(
    (query?: string, category?: string) =>
      searchQuickInsertItems(quickInsertState, {})(query, category),
    [quickInsertState],
  );

  const focusInEditor = useCallback(() => {
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }, [editorView]);

  const onInsertItem = useCallback(
    item => {
      closeElementBrowserModal()(editorView.state, editorView.dispatch);
      focusInEditor();
      insertItem(item)(editorView.state, editorView.dispatch);
    },
    [editorView.dispatch, editorView.state, focusInEditor],
  );

  const onClose = useCallback(() => {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
    focusInEditor();
  }, [editorView.dispatch, editorView.state, focusInEditor]);

  return (
    <ModalElementBrowser
      getItems={getItems}
      onInsertItem={onInsertItem}
      isOpen={
        (quickInsertState && quickInsertState.isElementBrowserModalOpen) ||
        false
      }
      onClose={onClose}
    />
  );
};

export default ({ editorView }: Props) => {
  const render = useCallback(
    ({ quickInsertState }) => (
      <Modal quickInsertState={quickInsertState} editorView={editorView} />
    ),
    [editorView],
  );
  return (
    <WithPluginState
      plugins={{ quickInsertState: pluginKey }}
      render={render}
    />
  );
};
