import React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import {
  FiWifi,
  FiWifiOff,
  FiCloud,
  FiCloudOff,
  FiPlus,
  FiTrash,
  FiUser,
  FiUserX,
  FiUsers,
} from 'react-icons/fi'

import { Stores } from '../stores'
import { IDBDocument } from '../types/document'

interface IProps {
  className?: string
  documents?: IDBDocument[]
  currentDocument?: IDBDocument | null
  unsyncedChanges?: boolean
  syncEnabled?: boolean
  collabEnabled?: boolean
  canEditCurrentDocument?: boolean
  toggleSyncing?: (documentId: string) => void
  toggleCollab?: () => void
  setCurrentDocument?: (id: string) => void
  createNewDocument?: () => void
  deleteDocument?: (id: string) => void
}

const DocumentBrowserEl = inject((stores: Stores) => ({
  documents: stores.documentStore.documents,
  currentDocument: stores.documentStore.currentDocument,
  unsyncedChanges: stores.documentStore.unsyncedChanges,
  syncEnabled: stores.syncStore.syncEnabled,
  collabEnabled: stores.documentStore.collabEnabled,
  canEditCurrentDocument: stores.documentStore.canEditCurrentDocument,
  toggleSyncing: stores.syncStore.toggleSyncing,
  toggleCollab: stores.documentStore.toggleCollab,
  setCurrentDocument: stores.documentStore.setCurrentDocument,
  createNewDocument: stores.documentStore.createNewDocument,
  deleteDocument: stores.documentStore.deleteDocument,
}))
(observer((props: IProps) => {
  const {
    className, documents, currentDocument, unsyncedChanges, syncEnabled, collabEnabled,
    canEditCurrentDocument,
    toggleSyncing, toggleCollab, setCurrentDocument, createNewDocument, deleteDocument,
  } = props
  function handleSyncClick() {
    if (syncEnabled && collabEnabled) toggleCollab!()
    toggleSyncing!(currentDocument?.id || '')
  }
  function handleCollabClick() {
    if (!syncEnabled) toggleSyncing!(currentDocument?.id || '')
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
      <ConnectionButton
        btnColor={unsyncedChanges ? 'red' : 'white'}
        title={`${unsyncedChanges ? 'Has' : 'No'} unsynced changes`}
      >
        { unsyncedChanges ? <FiWifiOff size={16}/> : <FiWifi size={16}/> }
      </ConnectionButton>
      <SyncButton
        btnColor={syncEnabled ? 'blue' : 'gray'}
        onClick={handleSyncClick}
        title="Toggle syncing of documents"
      >
        { syncEnabled ? <FiCloud size={16}/> : <FiCloudOff size={16}/> }
      </SyncButton>
      <SyncButton
        btnColor={collabEnabled ? 'blue' : !canEditCurrentDocument ? 'red' : 'gray'}
        onClick={handleCollabClick}
        title="Toggle collaborative editing"
      >
        { collabEnabled ? <FiUsers size={16}/> : canEditCurrentDocument ? <FiUser size={16}/> : <FiUserX size={16}/>}
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

const Button = styled.button`
  border: 0;
  border-radius: 100%;
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
`
type ButtonColor = 'gray' | 'blue' | 'red' | 'white'
const getBtnColor = (color?: ButtonColor, hover = false) => {
  switch (color) {
    case 'blue':
      return hover ? '--color-primary-light' : '--color-primary-lighter'
    case 'red':
      return '--color-light-red'
    case 'white':
      return '--color-bg-lightest'
    case 'gray':
    default:
      return hover ? '--color-gray' : '-color-gray-light'
  }
}
const SyncButton = styled(Button)<{ btnColor?: ButtonColor }>`
  background: var(${({ btnColor }) => getBtnColor(btnColor)});
  cursor: pointer;
  &:hover {
    background: var(${({ btnColor }) => getBtnColor(btnColor, true)});
  }
`
const ConnectionButton = styled(Button)<{ btnColor?: ButtonColor }>`
  background: var(${({ btnColor }) => getBtnColor(btnColor)});
  cursor: default;
  &:hover {
    background: var(${({ btnColor }) => getBtnColor(btnColor, true)});
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
  align-items: center;
  background: ${({ disabled, color }) => getColor(color, disabled)};
  border: 0;
  border-radius: 2px;
  color: #fff;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  display: flex;
  height: fit-content;
  justify-content: center;
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 35px;
  &:hover {
    background: ${({ disabled, color }) => getHoverColor(color, disabled)};
  }
`

export const DocumentBrowser = styled(DocumentBrowserEl)`
  align-items: center;
  display: flex;
`