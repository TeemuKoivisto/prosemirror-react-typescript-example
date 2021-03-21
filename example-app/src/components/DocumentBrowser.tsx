import * as React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import {
  FiPlus, FiRefreshCw
} from 'react-icons/fi'

import { Stores } from '../stores'
import { IDBDocument } from '../types/document'

interface IProps {
  className?: string
  documents?: IDBDocument[]
  currentDocument?: IDBDocument | null
  setCurrentDocument?: (id: string) => void
  createNewDocument?: () => void
  syncDocument?: () => void
}

const DocumentBrowserEl = inject((stores: Stores) => ({
  documents: stores.documentStore.documents,
  currentDocument: stores.documentStore.currentDocument,
  setCurrentDocument: stores.documentStore.setCurrentDocument,
  createNewDocument: stores.documentStore.createNewDocument,
  syncDocument: stores.documentStore.syncDocument,
  editorStore: stores.editorStore,
}))
(observer((props: IProps) => {
  const {
    className, documents, currentDocument, setCurrentDocument, createNewDocument, syncDocument
  } = props
  function onDocumentClick(id: string) {
    setCurrentDocument!(id)
  }
  function onNewDocumentClick() {
    createNewDocument!()
    syncDocument!()
  }
  return (
    <div className={className}>
      <SyncButton><FiRefreshCw size={16}/></SyncButton>
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
        <AddNewDoc onClick={onNewDocumentClick}>
          <FiPlus size={20}/>
        </AddNewDoc>
      </DocumentsList>
    </div>
  )
}))

const SyncButton = styled.button`
  background: #fff;
  border: 0;
  border-radius: 100%;
  cursor: pointer;
  height: fit-content;
  margin-right: 1rem;
  padding: 0.5rem;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    background: #bbb;
  }
`
const DocumentsList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
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
const AddNewDoc = styled.button`
  background: #9a69c7;
  border: 0;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: 1s background cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 35px;
  &:hover {
    background: var(--color-primary);
  }
`

export const DocumentBrowser = styled(DocumentBrowserEl)`
  display: flex;
`