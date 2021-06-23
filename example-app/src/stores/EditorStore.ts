import { EditorContext } from '@pm-react-example/full-v2'
import { EditorStateJSON } from '@pm-react-example/shared'
import { PMDoc } from '../types/document'

export class EditorStore {

  editorCtx?: EditorContext
  currentEditorState?: EditorStateJSON

  setEditorContext = (ctx: EditorContext) => {
    this.editorCtx = ctx
  }

  getEditorState = () => {
    return this.editorCtx!.viewProvider.stateToJSON()
  }

  createEmptyDoc = () : PMDoc => {
    const json = JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[]}]}')
    const node = this.editorCtx?.viewProvider.editorView.state.schema.nodeFromJSON(json)
    node.check()
    return node.toJSON()
  }

  setCurrentDoc = (doc?: PMDoc) => {
    const pmDoc = doc ?? this.createEmptyDoc()
    this.editorCtx?.viewProvider.replaceState(pmDoc)
  }

  reset = () => {
    this.setCurrentDoc()
  }
}
