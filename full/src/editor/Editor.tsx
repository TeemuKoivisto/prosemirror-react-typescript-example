import * as React from 'react'
import applyDevTools from 'prosemirror-dev-tools'
import styled from 'styled-components'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { schema } from './schema'
import { plugins } from './plugins'
import { PortalProvider } from './utils/PortalProvider'

import { nodeViews } from './nodeviews'

export class Editor extends React.Component<{}, {}> {
  editorRef: React.RefObject<any>

  editorState: EditorState
  editorView?: EditorView
  portalProvider: PortalProvider

  constructor(props: {}) {
    super(props)
    this.editorState = EditorState.create({
      schema,
      plugins: plugins(),
    })
    this.editorRef = React.createRef()
    this.portalProvider = new PortalProvider()
  }

  createEditorView(element: HTMLDivElement | null) {
    if (element !== null) {
      this.editorView = new EditorView(element, {
        nodeViews: nodeViews(this.portalProvider),
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
    return (
      <Container>
        <div id="editor" ref={this.editorRef} />
      </Container>
    )
  }
}

const Container = styled.div`
  border: 1px solid black;
  #editor > .ProseMirror {
    min-height: 140px;
    overflow-wrap: break-word;
    outline: none;
    padding: 10px;
    white-space: pre-wrap;
  }
`
