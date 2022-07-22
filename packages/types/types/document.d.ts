import { Step } from 'prosemirror-transform'

export interface EditorStateJSON {
  doc: { [key: string]: any }
  selection: { [key: string]: any }
  plugins: { [key: string]: any }
}
export type PMDoc = {
  [key: string]: any
}
export type PatchedStep = Step & { clientID: number }

export type DocVisibility = 'private' | 'global'
export interface IDBDocument {
  id: string
  title: string
  userId: string
  // createdAt: number
  // updatedAt: number
  doc: PMDoc
  visibility: DocVisibility
}

// POST /document
export interface ICreateDocumentParams {
  title: string
  doc: PMDoc
  visibility: DocVisibility
}
// GET /documents
export interface IGetDocumentsResponse {
  docs: IDBDocument[]
}
// GET /documents
export interface IGetDocumentResponse {
  doc: PMDoc
  userCount: number
  version: number
}