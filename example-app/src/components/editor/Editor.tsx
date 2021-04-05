import React, { useMemo } from 'react'
import debounce from 'lodash.debounce'
import { inject, observer } from 'mobx-react'

import {
  Editor as FullEditor, Base, BlockQuote, Collab,
  ReactEditorContext, PortalRenderer,
  EditorContext, APIProvider, createDefaultProviders
} from '@pm-react-example/full-v2'

import { DesktopLayout } from './DesktopLayout'

import { Stores } from '../../stores'

interface IProps {
  className?: string
  userId?: string
  documentId?: string
  collabEnabled?: boolean
  syncDocument?: () => void
  setEditorContext?: (ctx: EditorContext) => void
  setAPIProvider?: (apiProvider: APIProvider) => void
}

export const Editor = inject((stores: Stores) => ({
  userId: stores.authStore.user?.id,
  documentId: stores.documentStore?.currentDocument?.id,
  collabEnabled: stores.editorStore.collabEnabled,
  syncDocument: stores.documentStore.syncDocument,
  setEditorContext: stores.editorStore.setEditorContext,
  setAPIProvider: stores.syncStore.setAPIProvider,
}))
(observer((props: IProps) => {
  const {
    userId, documentId, collabEnabled, syncDocument, setEditorContext, setAPIProvider
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

  function handleDocumentEdit() {
    if (!collabEnabled) debouncedSync()
  }
  function handleEditorReady(ctx: EditorContext) {
    setEditorContext!(ctx)
    setAPIProvider!(ctx.apiProvider)
  }
  return (
    <ReactEditorContext.Provider value={providers}>
      <DesktopLayout>
        <FullEditor
          providers={providers}
          onDocumentEdit={handleDocumentEdit}
          onEditorReady={handleEditorReady}
        >
          <Base/>
          <BlockQuote />
          <Collab {...collab} />
        </FullEditor>
      </DesktopLayout>
      <PortalRenderer />
    </ReactEditorContext.Provider>
  )
}))
