import React, { useRef, useState } from 'react'
import { DirectEditorProps, EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'
import applyDevTools from 'prosemirror-dev-tools'
import {
  collab, receiveTransaction, sendableSteps, getVersion
} from 'prosemirror-collab'
import { Step } from 'prosemirror-transform'

import { useEditorContext } from './core/EditorContext'

import { createDefaultEditorPlugins } from './create-defaults'
import { createSchema } from './core/create/create-schema'
import { createPMPlugins, processPluginsList } from './core/create/create-plugins'
import {
  findChangedNodesFromTransaction,
  validateNodes,
  validNode,
} from './utils/nodes'
import { getDocStructure, SimplifiedNode } from './utils/document-logger'
import {
  sendSteps,
  getDocument,
  fetchEvents,
  IEventsResponse,
} from './collab-api'

import useSsrLayoutEffect from './react/hooks/useSsrLayoutEffect'

import { EditorProps } from './Editor'

interface IProps {
  editorProps: EditorProps
  EditorLayoutComponent: (props: any) => JSX.Element
}

let collabVersion = 0

export function ReactEditorView(props: IProps) {
  const { editorProps, EditorLayoutComponent } = props
  const { viewProvider, pluginsProvider, portalProvider, analyticsProvider } = useEditorContext()
  const editorViewRef = useRef(null)
  const [canDispatchTransactions, setCanDispatchTransactions] = useState(true)

  useSsrLayoutEffect(() => {
    const state = createEditorState()
    const editorViewDOM = editorViewRef.current
    if (editorViewDOM) {
      const pmEditorProps = createDirectEditorProps(state)
      const view = createEditorView(editorViewDOM, pmEditorProps)
      viewProvider.init(view)
      editorProps.onEditorReady && editorProps.onEditorReady(viewProvider)
      if (editorProps.collab) {
        getDocument().then(data => {
          viewProvider.replaceDocument(data.doc)
          collabVersion = data.version
          subscribeToCollab()
        })
      }
    }
    return () => {
      viewProvider.editorView.destroy()
    }
  }, [])

  function createEditorState() {
    const editorPlugins = createDefaultEditorPlugins(editorProps)
    const config = processPluginsList(editorPlugins)
    const schema = createSchema(config)

    const plugins = createPMPlugins({
      schema,
      editorConfig: config,
      portalProvider: portalProvider,
      pluginsProvider: pluginsProvider,
    })
    
    if (editorProps.collab) plugins.push(collab())
    
    return EditorState.create({
      schema,
      plugins,
    })
  }

  function createEditorView(element: HTMLDivElement, editorProps: DirectEditorProps) {
    const view = new EditorView({ mount: element }, editorProps)
    applyDevTools(view)
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
      editable: _state => !editorProps.disabled,
      attributes: { 'data-gramm': 'false' },
    }
  }

  function dispatchTransaction(transaction: Transaction) {
    const { editorView } = viewProvider
    if (!editorView) {
      return
    }

    const { shouldTrack } = editorProps
    analyticsProvider.perf.warn('EditorView', 'dispatchTransaction')

    const nodes: PMNode[] = findChangedNodesFromTransaction(transaction)
    const changedNodesValid = validateNodes(nodes)
    if (changedNodesValid) {
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
      analyticsProvider.perf.stop('EditorView', 'dispatchTransaction flush', 0)
      editorProps.collab && sendStepsToCollabServer(editorState)
      editorProps.onDocumentEdit && editorProps.onDocumentEdit(editorView)
    } else {
      const invalidNodes = nodes
        .filter(node => !validNode(node))
        .map<SimplifiedNode | string>(node => getDocStructure(node))

      if (shouldTrack) {
        console.error('Invalid nodes in transaction')
        console.log(transaction)
        console.log(invalidNodes)
      }
    }

    analyticsProvider.perf.stop('EditorView', 'dispatchTransaction', 1000)
  }

  async function subscribeToCollab() {
    const response = await fetchEvents(collabVersion)
    if (response.status == 502) {
      // Status 502 is a connection timeout error,
      // may happen when the connection was pending for too long,
      // and the remote server or a proxy closed it
      // let's reconnect
      await subscribeToCollab()
    } else if (response.status != 200) {
      // Reconnect in one second
      await new Promise(resolve => setTimeout(resolve, 1000))
      await subscribeToCollab()
    } else {
      // Get and show the message
      const data: IEventsResponse = await response.json()
      handleCollabEvents(data)
      subscribeToCollab()
    }
  }

  function handleCollabEvents(data: IEventsResponse) {
    const { editorView } = viewProvider
    let tr = receiveTransaction(
      editorView.state,
      data.steps.map(j => Step.fromJSON(editorView.state.schema, j)),
      data.clientIDs
    )
    editorView.dispatch(tr)
    collabVersion = data.version
  }

  async function sendStepsToCollabServer(newState: EditorState) {
    const sendable = sendableSteps(newState)
    if (sendable) {
      const { version } = await sendSteps({
        ...sendable,
        version: collabVersion
      })
      if (version) collabVersion = version
    }
  }

  return (
    <EditorLayoutComponent>
      <div ref={editorViewRef}/>
    </EditorLayoutComponent>
  )
}
