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

  constructor() {
    makeObservable(this)
  }

  setEditorView = (viewProvider: EditorViewProvider) => {
    this.viewProvider = viewProvider
  }

  getEditorState = () => {
    return this.viewProvider!.stateToJSON()
  }

  createEmptyDoc = () : PMDoc => {
    const json = JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[]}]}')
    const node = this.viewProvider?.editorView.state.schema.nodeFromJSON(json)
    node.check()
    return node.toJSON()
  }

  setCurrentDoc = (doc: PMDoc) => {
    this.viewProvider?.replaceDocument(doc)
  }

  @action toggleCollab = () => {
    this.collabEnabled = !this.collabEnabled
    this.collabVersion = 0
  }
}
