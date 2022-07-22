import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import { Editor, EditorViewProvider, JSONEditorState } from '@example/full'

import { PageHeader } from '../components/PageHeader'

interface IProps {
  className?: string
}

class EditorStore {

  viewProvider?: EditorViewProvider
  currentEditorState?: JSONEditorState
  STORAGE_KEY = 'full-editor-state'

  constructor() {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(this.STORAGE_KEY)
      if (existing && existing !== null && existing.length > 0) {
        let stored = JSON.parse(existing)
        this.currentEditorState = stored
      }
    }
  }

  setEditorView = (viewProvider: EditorViewProvider) => {
    this.viewProvider = viewProvider
    if (this.currentEditorState) {
      viewProvider.replaceState(this.currentEditorState)
    }
  }

  syncCurrentEditorState = () => {
    const newState = this.viewProvider!.stateToJSON()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState))
  }
}

export function FrontPage(props: IProps) {
  const { className } = props
  const editorStore = useMemo(() => new EditorStore(), [])
  const debouncedSync = useMemo(() => debounce(editorStore.syncCurrentEditorState, 500), [])

  function handleDocumentEdit() {
    debouncedSync()
  }
  function handleEditorReady(viewProvider: EditorViewProvider) {
    editorStore.setEditorView(viewProvider)
  }
  return (
    <Container className={className}>
      <PageHeader>
        <Editor
          analytics={{
            shouldTrack: true,
            logLevel: 'debug',
            logToConsole: true,
          }}
          onDocumentEdit={handleDocumentEdit}
          onEditorReady={handleEditorReady}
        />
      </PageHeader>
    </Container>
  )
}

const Container = styled.div`
`
