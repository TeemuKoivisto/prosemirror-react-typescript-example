import React, { useLayoutEffect, useRef, useState } from 'react'
import { DirectEditorProps, EditorView } from 'prosemirror-view'
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import applyDevTools from 'prosemirror-dev-tools'

import { useEditorContext } from './core/EditorContext'

import { createDefaultEditorPlugins } from './create-defaults'
import { createSchema } from './core/create/create-schema'
import { createPMPlugins, processPluginsList } from './core/create/create-plugins'

import { EditorProps } from './Editor'

interface IProps {
  editorProps: EditorProps
  EditorLayoutComponent: (props: any) => JSX.Element
}

export function ReactEditorView(props: IProps) {
  const { editorProps, EditorLayoutComponent } = props
  const { editorActions, editorPlugins, portalProvider } = useEditorContext()
  const editorViewRef = useRef(null)
  const [editorState, setEditorState] = useState<EditorState>()
  const [editorView, setEditorView] = useState<EditorView>()

  useLayoutEffect(() => {
    const state = createEditorState()
    setEditorState(state)
    const editorViewDOM = editorViewRef.current
    if (editorViewDOM) {
      const editorProps = createDirectEditorProps(state)
      const view = createEditorView(editorViewDOM, editorProps)
      setEditorView(view)
      editorActions.init(view)
    }
  }, [])

  function createEditorState() {
    const defaultEditorPlugins = createDefaultEditorPlugins(editorProps)
    const config = processPluginsList(defaultEditorPlugins)
    const schema = createSchema(config)

    const plugins = createPMPlugins({
      schema,
      editorConfig: config,
      portalProvider: portalProvider,
      editorPlugins: editorPlugins,
    })

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
      // Disables the contentEditable attribute of the editor if the editor is disabled
      editable: _state => true,
      attributes: { 'data-gramm': 'false' },
    }
  }

  return (
    <EditorLayoutComponent>
      <div ref={editorViewRef}/>
    </EditorLayoutComponent>
  )
}
