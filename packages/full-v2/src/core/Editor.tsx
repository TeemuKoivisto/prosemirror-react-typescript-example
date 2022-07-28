import React, { useRef, useState } from 'react'
import { DirectEditorProps, EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'

import { useEditorContext } from '@context'
import { useSsrLayoutEffect } from '@react'

import { EditorProps } from './types/editor'

export function Editor(props: EditorProps) {
  const ctx = useEditorContext()
  const { viewProvider, extensionProvider, analyticsProvider, collabProvider, portalProvider } = ctx
  const editorViewRef = useRef(null)
  const [canDispatchTransactions, setCanDispatchTransactions] = useState(true)

  useSsrLayoutEffect(() => {
    const state = createEditorState()
    const editorViewDOM = editorViewRef.current
    if (editorViewDOM) {
      const pmEditorProps = createDirectEditorProps(state)
      const view = createEditorView(editorViewDOM, pmEditorProps)
      viewProvider.init(view)
      props.onEditorReady && props?.onEditorReady(ctx)
    }
    return () => {
      viewProvider.editorView.destroy()
    }
  }, [])

  function createEditorState() {
    return EditorState.create({
      schema: extensionProvider.createSchema(),
      plugins: extensionProvider.createPlugins(),
    })
  }

  function createEditorView(element: HTMLDivElement, editorProps: DirectEditorProps) {
    const view = new EditorView({ mount: element }, editorProps)
    // @ts-ignore
    window.editorView = view
    return view
  }

  function createDirectEditorProps(state: EditorState): DirectEditorProps {
    return {
      state,
      dispatchTransaction: (tr: Transaction) => {
        // Block stale transactions:
        // Prevent runtime exceptions from async transactions that would attempt to
        // update the DOM after React has unmounted the Editor.
        if (canDispatchTransactions) {
          dispatchTransaction(tr)
        }
      },
      // Disables the contentEditable attribute of the editor if the editor is disabled
      editable: (_state) => !props.disabled,
      attributes: { 'data-gramm': 'false' },
    }
  }

  function dispatchTransaction(transaction: Transaction) {
    const { editorView } = viewProvider

    if (!editorView) {
      return
    }

    analyticsProvider.perf.warn('EditorView', 'dispatchTransaction')
    const oldEditorState = editorView.state
    // go ahead and update the state now we know the transaction is good
    analyticsProvider.perf.info('EditorView', 'dispatchTransaction state::apply')
    const editorState = editorView.state.apply(transaction)
    analyticsProvider.perf.stop('EditorView', 'dispatchTransaction state::apply', 200)

    if (editorState === oldEditorState) {
      // I don't think it's possible for the React nodeviews to change without changing PM editorState but
      // it's better to be safe than sorry I guess.
      portalProvider.flush()
      return
    }
    analyticsProvider.perf.warn('EditorView', 'dispatchTransaction updateState')
    editorView.updateState(editorState)
    analyticsProvider.perf.stop('EditorView', 'dispatchTransaction updateState', 100)
    analyticsProvider.perf.debug('EditorView', 'dispatchTransaction flush')
    portalProvider.flush()
    analyticsProvider.perf.stop('EditorView', 'dispatchTransaction flush', 100)
    // A bit hackish way to stop triggering sync events when the whole document is replaced by the user
    if (!transaction.getMeta('SKIP_AFTER_TR')) {
      afterTrHooks(editorState)
    }
    analyticsProvider.perf.stop('EditorView', 'dispatchTransaction', 1000)
  }

  function afterTrHooks(newState: EditorState) {
    if (props.onDocumentEdit) {
      props.onDocumentEdit(newState)
    }
    if (collabProvider.isCollaborating) {
      collabProvider.sendSteps(newState)
    }
  }

  return <div ref={editorViewRef}>{props.children}</div>
}
