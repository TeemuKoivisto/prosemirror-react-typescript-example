import { AuthStore } from './AuthStore'
import { DocumentStore } from './DocumentStore'
import { EditorStore } from './EditorStore'
import { SyncStore } from './SyncStore'
import { ToastStore } from './ToastStore'

export class Stores {

  authStore: AuthStore
  documentStore: DocumentStore
  editorStore: EditorStore
  syncStore: SyncStore
  toastStore: ToastStore

  constructor() {
    this.authStore = new AuthStore(this.reset)
    this.toastStore = new ToastStore()
    this.editorStore = new EditorStore()
    this.documentStore = new DocumentStore({
      authStore: this.authStore,
      editorStore: this.editorStore,
      toastStore: this.toastStore
    })
    this.syncStore = new SyncStore({
      authStore: this.authStore,
      documentStore: this.documentStore,
      toastStore: this.toastStore
    })
  }

  reset = () => {
    this.authStore.reset()
    this.documentStore.reset()
    this.editorStore.reset()
    this.syncStore.reset()
    this.toastStore.reset()
  }
}
