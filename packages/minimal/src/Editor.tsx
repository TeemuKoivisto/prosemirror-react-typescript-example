import * as React from 'react'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { schema } from './schema'
import { plugins } from './plugins'

import { nodeViews } from './nodeviews'

import './Editor.scss'

export class Editor extends React.Component<{}, {}> {
  editorRef: React.RefObject<HTMLDivElement>

  editorState: EditorState
  editorView?: EditorView

  constructor(props: {}) {
    super(props)
    this.editorState = EditorState.create({
      schema,
      plugins: plugins(),
    })
    this.editorRef = React.createRef()
  }

  createEditorView = (element: HTMLDivElement | null) => {
    if (element != null) {
      this.editorView = new EditorView(element, {
        nodeViews,
        state: this.editorState,
      })
    }
  }

  componentDidMount() {
    this.createEditorView(this.editorRef.current)
    this.forceUpdate()
  }

  componentWillUnmount() {
    if (this.editorView) {
      this.editorView.destroy()
    }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div id="minimal-editor" ref={this.editorRef} />
  }
}
