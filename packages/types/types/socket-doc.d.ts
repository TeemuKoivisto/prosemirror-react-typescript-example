import { IDBDocument, DocVisibility } from './document'

import { EDocAction } from '../src'

export { EDocAction } from '../src'

// Document sync actions
export enum EDocAction {
  DOC_CREATE = 'doc:create',
  DOC_DELETE = 'doc:delete',
  DOC_VISIBILITY = 'doc:visibility'
}
export type DocAction = IDocCreateAction | IDocDeleteAction | IDocVisibilityAction
export interface IDocCreateAction {
  type: EDocAction.DOC_CREATE
  payload: {
    doc: IDBDocument
    userId: string
  }
}
export interface IDocDeleteAction {
  type: EDocAction.DOC_DELETE
  payload: {
    documentId: string
    userId: string
  }
}
export interface IDocVisibilityAction {
  type: EDocAction.DOC_VISIBILITY
  payload: {
    documentId: string
    visibility: DocVisibility
    userId: string
  }
}