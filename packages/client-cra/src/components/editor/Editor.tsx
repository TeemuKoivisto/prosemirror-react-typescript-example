import React, { useMemo } from 'react'
import debounce from 'lodash.debounce'
import { inject, observer } from 'mobx-react'
import { EditorState } from 'prosemirror-state'
import { applyDevTools } from 'prosemirror-dev-toolkit'

import {
  Editor as FullEditor, Base, BlockQuote, Collab,
  ReactEditorContext, PortalRenderer,
  EditorContext, APIProvider, createDefaultProviders
} from '@example/full-v2'

import { DesktopLayout } from './DesktopLayout'

import { Stores } from '../../stores'
import { DocumentStore } from '../../stores/DocumentStore'

interface IProps {
  className?: string
  userId?: string
  documentId?: string
  collabEnabled?: boolean
  documentStore?: DocumentStore
  syncDocument?: () => void
  setEditorContext?: (ctx: EditorContext) => void
  setAPIProvider?: (apiProvider: APIProvider) => void
}

export const Editor = inject((stores: Stores) => ({
  userId: stores.authStore.user?.id,
  documentId: stores.documentStore?.currentDocument?.id,
  collabEnabled: stores.documentStore.collabEnabled,
  documentStore: stores.documentStore,
  syncDocument: stores.documentStore.syncDocument,
  setEditorContext: stores.editorStore.setEditorContext,
  setAPIProvider: stores.syncStore.setAPIProvider,
}))
(observer((props: IProps) => {
  const {
    userId, documentId, collabEnabled, documentStore, syncDocument, setEditorContext, setAPIProvider
  } = props
  const providers = useMemo(() => createDefaultProviders(), [])
  const debouncedSync = useMemo(() => debounce(syncDocument!, 500), [])
  const collab = useMemo(() => {
    if (collabEnabled) {
      return {
        userId,
        documentId
      }
    }
    return undefined
  }, [userId, documentId, collabEnabled])

  function handleDocumentEdit(_newState: EditorState) {
    // I'm at my wit's end to find a reason why collabEnabled won't update while documentStore.collabEnabled
    // shows it's been updated! Also Collab JSX element is notified nicely yet the values stay undefined/whatever
    // when referenced here eg documentId
    // if (!collabEnabled) debouncedSync() // Won't work
    if (!documentStore!.collabEnabled) debouncedSync()
  }
  function handleEditorReady(ctx: EditorContext) {
    setEditorContext!(ctx)
    setAPIProvider!(ctx.apiProvider)
    applyDevTools(ctx.viewProvider.editorView)
  }
  return (
    <ReactEditorContext.Provider value={providers}>
      <DesktopLayout>
        <FullEditor
          onDocumentEdit={handleDocumentEdit}
          onEditorReady={handleEditorReady}
        >
          <Base/>
          <BlockQuote/>
          <Collab {...collab} />
        </FullEditor>
      </DesktopLayout>
      <PortalRenderer />
    </ReactEditorContext.Provider>
  )
}))
