import { DocumentStore } from './DocumentStore'
import { EditorStore } from './EditorStore'
import { SyncStore } from './SyncStore'
import { ToastStore } from './ToastStore'

export class Stores {

  documentStore: DocumentStore
  editorStore: EditorStore
  syncStore: SyncStore
  toastStore: ToastStore

  constructor() {
    this.toastStore = new ToastStore()
    this.editorStore = new EditorStore()
    this.documentStore = new DocumentStore(this.editorStore)
    this.syncStore = new SyncStore(this.documentStore, this.toastStore)
  }
}
