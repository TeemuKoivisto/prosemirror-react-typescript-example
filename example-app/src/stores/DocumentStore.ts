import { action, computed, observable, makeObservable, runInAction } from 'mobx'
import { EditorStore } from './EditorStore'

import { IDBDocument, PMDoc, uuidv4 } from '@pm-react-example/shared'

import { getDocuments, createDocument, updateDocument, deleteDocument } from '../document-api'

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
    const { doc } = this.editorStore.getEditorState()
    if (this.currentDocument) {
      // There might be unsaved changes as the debouncing takes a half sec after
      // user has stopped typing. Could probably set it to lower and just omit this 🤔
      this.updateDocument(this.currentDocument.id, { ...this.currentDocument, doc })
    }
    this.currentDocument = this.documentsMap.get(id) ?? null
    this.editorStore.setCurrentDoc(this.currentDocument?.doc)
  }

  @action createNewDocument = async (existingDoc?: PMDoc) => {
    const doc = existingDoc ?? this.editorStore.createEmptyDoc()
    const params = { title: 'Untitled', doc }
    let result
    try {
      result = await createDocument(params)
    } catch (err) {
    }
    // Incase the server is down or just not in use, create a local document
    // that hopefully will be synced to the server
    const id = result ? result.id : uuidv4()
    if (!result) {
      result = { id, ...params }
    }
    this.documentsMap.set(id, result)
    this.currentDocument = result
    this.editorStore.setCurrentDoc(doc)
    return result
  }

  @action updateDocument = async (id: string, doc: IDBDocument) => {
    try {
      await updateDocument(id, doc)
    } catch (err) {
      // TOOO: Should probably retry or something -> needs a robust event bus
      // Redux? oh god this gets so complicated
      // Probably with a websocket this becomes easier
    }
    runInAction(() => {
      this.documentsMap.set(id, doc)
    })
  }

  @action deleteDocument = async (id: string) => {
    try {
      await deleteDocument(id)
    } catch (err) {
    }
    runInAction(() => {
      this.documentsMap.delete(id)
      this.currentDocument = this.documents[0] ?? null
      const doc = this.currentDocument?.doc ?? this.editorStore.createEmptyDoc()
      this.editorStore.setCurrentDoc(doc)
    })
  }

  @action syncDocument = () => {
    const { doc } = this.editorStore.getEditorState()
    if (!this.currentDocument) {
      this.createNewDocument(doc)
    } else {
      this.updateDocument(this.currentDocument.id, { ...this.currentDocument, doc })
    }
  }
}