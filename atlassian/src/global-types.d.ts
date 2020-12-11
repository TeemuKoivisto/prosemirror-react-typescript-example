declare module 'prosemirror-dev-tools' {
  import { EditorView } from "prosemirror-view"
  const applyDevTools: (view: EditorView) => void
  export = applyDevTools
}
