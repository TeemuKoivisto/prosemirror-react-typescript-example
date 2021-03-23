import * as React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import {
  FiCloud,
  FiCloudOff,
  FiPlus,
  FiUser,
  FiUsers,
} from 'react-icons/fi'

import { Stores } from '../stores'
import { IDBDocument } from '../types/document'

interface IProps {
  className?: string
  documents?: IDBDocument[]
  currentDocument?: IDBDocument | null
  syncToAPI?: boolean
  collabEnabled?: boolean
  toggleSyncToAPI?: () => void
  toggleCollab?: () => void
  setCurrentDocument?: (id: string) => void
  createNewDocument?: () => void
  syncDocument?: () => void
}

const DocumentBrowserEl = inject((stores: Stores) => ({
  documents: stores.documentStore.documents,
  currentDocument: stores.documentStore.currentDocument,
  syncToAPI: stores.documentStore.syncToAPI,
  collabEnabled: stores.editorStore.collabEnabled,
  toggleSyncToAPI: stores.documentStore.toggleSyncToAPI,
  toggleCollab: stores.editorStore.toggleCollab,
  setCurrentDocument: stores.documentStore.setCurrentDocument,
  createNewDocument: stores.documentStore.createNewDocument,
  syncDocument: stores.documentStore.syncDocument,
}))
(observer((props: IProps) => {
  const {
    className, documents, currentDocument, syncToAPI, collabEnabled,
    toggleSyncToAPI, toggleCollab, setCurrentDocument, createNewDocument, syncDocument
  } = props
  function handleSyncClick() {
    toggleSyncToAPI!()
  }
  function handleCollabClick() {
    if (!syncToAPI) toggleSyncToAPI!()
    toggleCollab!()
  }
  function onDocumentClick(id: string) {
    setCurrentDocument!(id)
  }
  function onNewDocumentClick() {
    createNewDocument!()
    syncDocument!()
  }
  return (
    <div className={className}>
      <SyncButton active={syncToAPI} onClick={handleSyncClick} title="Toggle syncing of documents">
        { syncToAPI ? <FiCloud size={16}/> : <FiCloudOff size={16}/> }
      </SyncButton>
      <SyncButton active={collabEnabled} onClick={handleCollabClick} title="Toggle collaborative editing">
        { collabEnabled ? <FiUsers size={16}/> : <FiUser size={16}/> }
      </SyncButton>
      <AddNewDocButton onClick={onNewDocumentClick}>
        <FiPlus size={20}/>
      </AddNewDocButton>
      <DocumentsList>
        { documents!.map(d =>
        <Doc
          key={d.id}
          selected={currentDocument?.id === d.id}
          onClick={() => onDocumentClick(d.id)}
        >
          {d.title}
        </Doc>  
        )}
      </DocumentsList>
    </div>
  )
}))

const SyncButton = styled.button<{ active?: boolean }> `
  background: ${({ active }) => active ? '#b9ceff' : '#e2e2e2'};
  border: 0;
  border-radius: 100%;
  cursor: pointer;
  height: fit-content;
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    background: ${({ active }) => active ? '#9a69c7' : '#bbb'};
  }
`
const DocumentsList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  overflow-x: scroll;
  padding: 0;
  & > * + * {
    margin-left: 1rem;
  }
`
const Doc = styled.li<{ selected?: boolean }>`
  background: ${({ selected }) => selected ? '#eee' : '#eee'};
  border: 1px solid ${({ selected }) => selected ? '#222' : 'transparent'};
  border-radius: 2px;
  cursor: pointer;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    background: #bbb;
  }
`
const AddNewDocButton = styled.button`
  background: #9a69c7;
  border: 0;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 35px;
  &:hover {
    background: var(--color-primary);
  }
`

export const DocumentBrowser = styled(DocumentBrowserEl)`
  display: flex;
`