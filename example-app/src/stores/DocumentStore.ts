import { action, computed, observable, makeObservable } from 'mobx'
import { EditorStore } from './EditorStore'

import { IDBDocument, uuidv4 } from '@pm-react-example/shared'

import { getDocuments } from '../document-api'

export class DocumentStore {

  @observable documentsMap: Map<string, IDBDocument> = new Map()
  @observable currentDocument: IDBDocument | null = null
  @observable syncToAPI: boolean = false
  STORAGE_KEY = 'full-editor-documents'

  editorStore: EditorStore

  constructor(editorStore: EditorStore) {
    makeObservable(this)
    this.editorStore = editorStore
    if (typeof window === 'undefined') return
    const existing = localStorage.getItem(this.STORAGE_KEY)
    if (existing && existing !== null && existing.length > 0) {
      // const parsed: [string, IDBDocument][] = JSON.parse(existing)
      // parsed.forEach(mapValue => {
      //   this.documentsMap.set(mapValue[0], {
      //     id: mapValue[0],
      //     doc: parseDoc(mapValue[1]),
      //   })
      // })
    }
  }

  @computed get documents(): IDBDocument[] {
    return Array.from(this.documentsMap.entries()).map(
      ([_id, doc]) => doc
    )
  }

  @action toggleSyncToAPI = async () => {
    this.syncToAPI = !this.syncToAPI
    if (this.syncToAPI) {
      const { docs } = await getDocuments()
      this.handleDocumentsChanged(docs)
    }
  }

  /**
   * Synchronizes the added and deleted documents NOT the content (this done through the editor collab sync)
   * @param resp 
   */
  @action handleDocumentsChanged = (docs: IDBDocument[]) => {
    const currentDocsIds = Array.from(this.documentsMap.entries()).map(([id, _doc]) => id)
    docs.forEach(d => {
      const idx = currentDocsIds.indexOf(d.id)
      if (idx === -1) {
        this.documentsMap.set(d.id, d)
      }
      currentDocsIds.splice(idx, 1)
    })
    // TODO use this to save the locally created documents
    return currentDocsIds
  }

  @action setCurrentDocument = (id: string) => {
    this.currentDocument = this.documentsMap.get(id) ?? null
    if (this.currentDocument) {
      this.editorStore.setCurrentDoc(this.currentDocument.doc)
    }
  }

  @action createNewDocument = () => {
    const id = uuidv4()
    const doc = this.editorStore.createEmptyDoc()
    const newDocument = { id, title: 'Untitled', doc }
    this.documentsMap.set(id, newDocument)
    this.currentDocument = newDocument
    this.editorStore.setCurrentDoc(doc)
    return newDocument
  }

  @action updateDocument = (id: string, doc: IDBDocument) => {
    this.documentsMap.set(id, doc)
  }

  @action syncDocument = () => {
    const { doc } = this.editorStore.syncStoredEditorState()
    if (!this.currentDocument) {
      const id = uuidv4()
      const newDocument = { id, title: 'Untitled', doc }
      this.documentsMap.set(id, newDocument)
      this.currentDocument = newDocument
    }
    this.documentsMap.set(this.currentDocument.id, this.currentDocument)
  }
}