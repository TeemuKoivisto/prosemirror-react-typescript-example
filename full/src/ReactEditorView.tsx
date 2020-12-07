import React, { useLayoutEffect, useRef, useState } from 'react'
import { DirectEditorProps, EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import applyDevTools from 'prosemirror-dev-tools'

import { useEditorContext } from './core/EditorContext'

import { schema } from './schema'
import { plugins } from './plugins'
import { nodeViews } from './nodeviews'

import { EditorProps } from './Editor'

interface IProps {
  // children: React.ReactChildren
  editorProps: EditorProps
  EditorLayoutComponent: (props: any) => JSX.Element
}

export function ReactEditorView(props: IProps) {
  const { editorProps, EditorLayoutComponent } = props
  const { editorActions, portalProvider } = useEditorContext()
  const editorViewRef = useRef(null)
  const [editorState, setEditorState] = useState<EditorState>()
  const [editorView, setEditorView] = useState<EditorView>()

  useLayoutEffect(() => {
    const state = createEditorState()
    setEditorState(state)
    const editorViewDOM = editorViewRef.current
    if (editorViewDOM) {
      const view = createEditorView(editorViewDOM, state)
      setEditorView(view)
      editorActions.init(view)
    }
  }, [])

  function createEditorState() {
    return EditorState.create({
      schema,
      plugins: plugins(),
    })
  }

  function createEditorView(element: HTMLDivElement, state: EditorState) {
    // Creates the editor-view from this.editorState. If an editor has been mounted
    // previously, this will contain the previous state of the editor.
    const view = new EditorView({
      mount: element
    }, {
      state,
      nodeViews: nodeViews(portalProvider),
    })
    applyDevTools(view)
    return view
  }

  return (
    <EditorLayoutComponent>
      <div
        className={"editor"}
        key="ProseMirror"
        ref={editorViewRef}
      />
    </EditorLayoutComponent>
  )
}
