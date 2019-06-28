import * as React from 'react'
import applyDevTools from 'prosemirror-dev-tools'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { schema } from './schema'
import { plugins } from './plugins'

import { nodeViews } from './nodeviews'

export class Editor extends React.Component<{}, {}> {
  editorState: EditorState
  editorView?: EditorView

  constructor(props: {}) {
    super(props)
    this.editorState = EditorState.create({
      schema,
      plugins: plugins(),
    })
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

  componentWillUnmount() {
    if (this.editorView) {
      this.editorView.destroy()
    }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div id="editor" ref={ref => { this.createEditorView(ref) }} />
  }
}
