export interface JSONEditorState {
  doc: { [key: string]: any }
  selection: { [key: string]: any }
  plugins: { [key: string]: any }
}