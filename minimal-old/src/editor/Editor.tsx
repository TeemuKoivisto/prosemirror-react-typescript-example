import * as React from 'react'
import applyDevTools from 'prosemirror-dev-tools'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { schema } from './schema'
import { plugins } from './plugins'

import { nodeViews } from './nodeviews'

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
      applyDevTools(this.editorView)
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
    return <div id="editor" ref={this.editorRef} />
  }
}
