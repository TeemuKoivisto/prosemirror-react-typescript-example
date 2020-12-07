import { EditorView } from 'prosemirror-view'

export class EditorActions {
  
  _editorView?: EditorView

  init(view: EditorView) {
    this._editorView = view
  }

  get editorView() : EditorView {
    if (!this._editorView) {
      throw Error('EditorActions editorView accessed without editorView instance')
    }
    return this._editorView
  }
  
  focus(): boolean {
    if (!this._editorView || this._editorView.hasFocus()) {
      return false;
    }

    this._editorView.focus();
    this._editorView.dispatch(this._editorView.state.tr.scrollIntoView());
    return true;
  }

  blur(): boolean {
    if (!this._editorView || !this._editorView.hasFocus()) {
      return false;
    }

    (this._editorView.dom as HTMLElement).blur();
    return true;
  }
}
