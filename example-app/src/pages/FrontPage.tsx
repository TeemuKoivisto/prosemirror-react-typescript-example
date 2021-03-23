import React, { useMemo } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import { inject, observer } from 'mobx-react'

import { Editor, EditorViewProvider } from '@pm-react-example/full'

import { PageHeader } from '../components/PageHeader'
import { DocumentBrowser } from '../components/DocumentBrowser'

import { Stores } from '../stores'
import { DocumentStore } from '../stores/DocumentStore'
import { EditorStore } from '../stores/EditorStore'

interface IProps {
  className?: string
  documentStore?: DocumentStore
  editorStore?: EditorStore
}

export const FrontPage = inject((stores: Stores) => ({
  documentStore: stores.documentStore,
  editorStore: stores.editorStore,
}))
(observer((props: IProps) => {
  const { className, documentStore, editorStore } = props
  const debouncedSync = useMemo(() => debounce(documentStore!.syncDocument, 500), [])
  const collab = useMemo(() => {
    if (editorStore!.collabEnabled) {
      if (documentStore!.currentDocument) {
        return {
          documentId: documentStore!.currentDocument.id
        }
      }
      documentStore!.syncDocument()
    }
    return undefined
  }, [documentStore?.currentDocument, editorStore!.collabEnabled])

  function handleDocumentEdit() {
    debouncedSync()
  }
  function handleEditorReady(viewProvider: EditorViewProvider) {
    editorStore!.setEditorView(viewProvider)
  }
  return (
    <Container className={className}>
      <PageHeader />
      <DocumentBrowser />
      <Editor
        analytics={{
          shouldTrack: true,
          logLevel: 'debug',
          logToConsole: true,
        }}
        collab={collab}
        onDocumentEdit={handleDocumentEdit}
        onEditorReady={handleEditorReady}
      />
    </Container>
  )
}))

const Container = styled.div`
  & > ${DocumentBrowser} {
    margin: 1rem 0;
  }
`
