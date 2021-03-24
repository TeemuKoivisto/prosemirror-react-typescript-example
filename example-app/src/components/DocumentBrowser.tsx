import * as React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import {
  FiCloud,
  FiCloudOff,
  FiPlus,
  FiTrash,
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
  deleteDocument?: (id: string) => void
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
  deleteDocument: stores.documentStore.deleteDocument,
  syncDocument: stores.documentStore.syncDocument,
}))
(observer((props: IProps) => {
  const {
    className, documents, currentDocument, syncToAPI, collabEnabled,
    toggleSyncToAPI, toggleCollab, setCurrentDocument, createNewDocument, deleteDocument, syncDocument
  } = props
  function handleSyncClick() {
    if (syncToAPI && collabEnabled) toggleCollab!()
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
  }
  function onDeleteDocumentClick() {
    if (currentDocument) {
      deleteDocument!(currentDocument.id)
    }
  }
  return (
    <div className={className}>
      <SyncButton active={syncToAPI} onClick={handleSyncClick} title="Toggle syncing of documents">
        { syncToAPI ? <FiCloud size={16}/> : <FiCloudOff size={16}/> }
      </SyncButton>
      <SyncButton active={collabEnabled} onClick={handleCollabClick} title="Toggle collaborative editing">
        { collabEnabled ? <FiUsers size={16}/> : <FiUser size={16}/> }
      </SyncButton>
      <SquareButton color="primary-light" onClick={onNewDocumentClick}>
        <FiPlus size={20}/>
      </SquareButton>
      <SquareButton color="danger-red" disabled={!currentDocument} onClick={onDeleteDocumentClick}>
        <FiTrash size={20} />
      </SquareButton>
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
  background: var(${({ active }) => active ? '--color-primary-lighter' : '--color-gray-light'});
  border: 0;
  border-radius: 100%;
  cursor: pointer;
  height: fit-content;
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    background: var(${({ active }) => active ? '--color-primary-light' : '--color-gray'});
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
  border: 1px solid ${({ selected }) => selected ? 'var(--color-text-dark)' : 'transparent'};
  border-radius: 2px;
  cursor: pointer;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    background: #bbb;
  }
`
const getColor = (color: string, disabled?: boolean) => {
  if (disabled) return 'var(--color-gray-light)'
  if (color === 'primary-light') return 'var(--color-primary-light)'
  if (color === 'danger-red') return '#ff7575'
  return 'black'
}
const getHoverColor = (color: string, disabled?: boolean) => {
  if (disabled) return 'var(--color-gray-light)'
  if (color === 'primary-light') return 'var(--color-primary)'
  if (color === 'danger-red') return 'red'
  return 'black'
}
const SquareButton = styled.button<{ color: string }>`
  background: ${({ disabled, color }) => getColor(color, disabled)};
  border: 0;
  border-radius: 2px;
  color: #fff;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 35px;
  &:hover {
    background: ${({ disabled, color }) => getHoverColor(color, disabled)};
  }
`

export const DocumentBrowser = styled(DocumentBrowserEl)`
  display: flex;
`