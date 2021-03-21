import {
  EditorViewProvider,
  JSONEditorState,
} from '@pm-react-example/full'
import { Node as PMNode } from 'prosemirror-model'
import { PMDoc } from '../types/document'

export class EditorStore {

  viewProvider?: EditorViewProvider
  currentEditorState?: JSONEditorState
  STORAGE_KEY = 'full-editor-state'

  constructor() {
    if (typeof window === 'undefined') return
    const existing = localStorage.getItem(this.STORAGE_KEY)
    if (existing && existing !== null && existing.length > 0) {
      let stored = JSON.parse(existing)
      this.currentEditorState = stored
    }
  }

  setEditorView = (viewProvider: EditorViewProvider) => {
    this.viewProvider = viewProvider
    if (this.currentEditorState) {
      // viewProvider.replaceState(this.currentEditorState)
    }
  }

  syncStoredEditorState = () => {
    const newState = this.viewProvider!.stateToJSON()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState))
    return newState
  }

  createEmptyDoc = () => {
    const json = JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[]}]}')
    const node = this.viewProvider?.editorView.state.schema.nodeFromJSON(json)
    node.check()
    return json
  }

  setCurrentDoc = (doc: PMDoc) => {
    this.viewProvider?.replaceDocument(doc)
    const newState = this.viewProvider!.stateToJSON()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState))
  }
}
