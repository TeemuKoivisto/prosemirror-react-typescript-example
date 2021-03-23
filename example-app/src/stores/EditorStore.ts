import { action, observable, makeObservable } from 'mobx'
import {
  EditorViewProvider,
  JSONEditorState,
} from '@pm-react-example/full'
import { PMDoc } from '../types/document'

export class EditorStore {

  viewProvider?: EditorViewProvider
  currentEditorState?: JSONEditorState
  @observable collabEnabled: boolean = false
  @observable collabVersion: number = 0
  STORAGE_KEY = 'full-editor-state'

  constructor() {
    makeObservable(this)
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

  @action toggleCollab = () => {
    this.collabEnabled = !this.collabEnabled
    this.collabVersion = 0
  }
}
