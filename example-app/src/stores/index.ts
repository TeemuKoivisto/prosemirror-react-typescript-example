import { DocumentStore } from './DocumentStore'
import { EditorStore } from './EditorStore'

export class Stores {

  documentStore: DocumentStore
  editorStore: EditorStore

  constructor() {
    this.editorStore = new EditorStore()
    this.documentStore = new DocumentStore(this.editorStore)
  }
}
