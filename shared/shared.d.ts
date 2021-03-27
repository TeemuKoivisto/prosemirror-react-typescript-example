import { Step } from 'prosemirror-transform'
import { Transaction } from 'prosemirror-state'

declare module '@pm-react-example/shared' {  

  // DBDocument
  export type PMDoc = {
    [key: string]: any
  }
  export interface IDBDocument {
    id: string
    title: string
    // createdAt: number
    // updatedAt: number
    doc: PMDoc
  }

  // User
  export interface IUser {
    id: string
    name: string
  }

  // Document API
  export interface ICreateDocumentParams {
    title: string
    doc: PMDoc
  }
  export interface IGetDocumentsResponse {
    docs: IDBDocument[]
  }
  export interface IGetDocumentResponse {
    doc: PMDoc
    userCount: number
    version: number
  }

  // Collab API
  export interface ISaveCollabStepsParams {
    version: number
    steps: Step[]
    clientID: number
    origins: Transaction[]
  }
  export interface INewStepsResponse {
    version: number
    steps: { [key: string]: any }[]
    clientIDs: number[]
    usersCount: number
  }

  // Socket IO actions
  export enum EActionType {
    DOC_CREATE = 'doc:create',
    DOC_DELETE = 'doc:delete',
    DOC_LOCK = 'doc:lock'
  }
  export type Action = IDocCreateAction | IDocDeleteAction
  export interface IDocCreateAction {
    type: EActionType.DOC_CREATE
    payload: {
      doc: IDBDocument
    }
  }
  export interface IDocDeleteAction {
    type: EActionType.DOC_DELETE
    payload: {
      documentId: string
    }
  }
  export interface IDocLockAction {
    type: EActionType.DOC_LOCK
    payload: {
      documentId?: string
    }
  }

  // Utils
  export const uuidv4: () => string
}
