import { EditorView } from 'prosemirror-view'
import { MarkType, NodeType } from 'prosemirror-model'
import { EditorState, Selection } from 'prosemirror-state'

import { Command, JSONEditorState, parseRawValue } from '@core'

export class EditorViewProvider {
  _editorView?: EditorView

  init(view: EditorView) {
    this._editorView = view
  }

  get editorView(): EditorView {
    if (!this._editorView) {
      throw Error('EditorViewProvider editorView accessed without editorView instance')
    }
    return this._editorView
  }

  getMarks(): { [key: string]: MarkType } {
    return this.editorView.state.schema.marks
  }

  getNodes(): { [key: string]: NodeType } {
    return this.editorView.state.schema.nodes
  }

  execCommand(cmd: Command) {
    cmd(this.editorView.state, this.editorView.dispatch)
    this.focus()
  }

  focus(): boolean {
    if (!this._editorView || this._editorView.hasFocus()) {
      return false
    }

    this._editorView.focus()
    this._editorView.dispatch(this._editorView.state.tr.scrollIntoView())
    return true
  }

  blur(): boolean {
    if (!this._editorView || !this._editorView.hasFocus()) {
      return false
    }

    ;(this._editorView.dom as HTMLElement).blur()
    return true
  }

  stateToJSON() {
    const state = this.editorView.state.toJSON()
    return { ...state, plugins: [] } as unknown as JSONEditorState
  }

  replaceState(doc: { [key: string]: any }, selection?: { [key: string]: any }) {
    const rawValue = {
      doc,
      selection: selection ?? { type: 'text', anchor: 1, head: 1 },
    }
    const state = EditorState.fromJSON(
      {
        schema: this.editorView.state.schema,
        plugins: this.editorView.state.plugins,
      },
      rawValue
    )
    this.editorView.updateState(state)

    // Fire an empty transaction to trigger PortalProvider to flush the created nodeViews
    const tr = this.editorView.state.tr
    this.editorView.dispatch(tr)
  }

  replaceDocument(
    rawValue: { [key: string]: any },
    options: {
      shouldScrollToBottom?: boolean
      shouldAddToHistory?: boolean
      triggerAfterTrEvents?: boolean
    } = {}
  ): boolean {
    if (!this.editorView || rawValue === undefined || rawValue === null) {
      return false
    }

    const { state } = this.editorView
    const { schema } = state
    const { shouldScrollToBottom, shouldAddToHistory, triggerAfterTrEvents } = options

    const content = parseRawValue(rawValue, schema)

    if (!content) {
      return false
    }

    // In case of replacing a whole document, we only need a content of a top level node e.g. document.
    let tr = state.tr.replaceWith(0, state.doc.nodeSize - 2, content.content)
    if (!shouldScrollToBottom && !tr.selectionSet) {
      // Restore selection at start of document instead of the end.
      tr.setSelection(Selection.atStart(tr.doc))
    }

    if (shouldScrollToBottom) {
      tr = tr.scrollIntoView()
    }
    if (!shouldAddToHistory) {
      tr.setMeta('addToHistory', false)
    }
    if (!triggerAfterTrEvents) {
      tr.setMeta('SKIP_AFTER_TR', true)
    }
    this.editorView.dispatch(tr)
    return true
  }
}
