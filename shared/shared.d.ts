import { Step } from 'prosemirror-transform'
import { Transaction } from 'prosemirror-state'

declare module '@pm-react-example/shared' {  

  // DBDocument
  export interface EditorStateJSON {
    doc: { [key: string]: any }
    selection: { [key: string]: any }
    plugins: { [key: string]: any }
  }
  export type PMDoc = {
    [key: string]: any
  }
  export type PatchedStep = Step & { clientID: number }
  export interface IDBDocument {
    id: string
    title: string
    // createdAt: number
    // updatedAt: number
    doc: PMDoc
    collab: boolean
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
    collab?: boolean
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
  export interface IJoinResponse {
    doc: PMDoc
    steps: PatchedStep[]
    version: number
    userCount: number
  }
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

  // Document sync actions
  export enum EActionType {
    DOC_CREATE = 'doc:create',
    DOC_DELETE = 'doc:delete',
    DOC_SELECT = 'doc:select'
  }
  export type Action = IDocCreateAction | IDocDeleteAction
  export interface IDocCreateAction {
    type: EActionType.DOC_CREATE
    payload: {
      doc: IDBDocument
      userId: string
    }
  }
  export interface IDocDeleteAction {
    type: EActionType.DOC_DELETE
    payload: {
      documentId: string
      userId: string
    }
  }
  export interface IDocSelectAction {
    type: EActionType.DOC_SELECT
    payload: {
      documentId?: string
    }
  }

  // Editor socket action
  export type EditorSocketAction = CollabAction
  export type EditorSocketActionType = ECollabActionType

  // Collab actions
  // REMEMBER: when adding enums, update the shared.js file
  export enum ECollabActionType {
    COLLAB_USERS_CHANGED = 'COLLAB:CLIENT_JOIN',
    COLLAB_CLIENT_EDIT = 'COLLAB:CLIENT_EDIT',
    COLLAB_SERVER_UPDATE = 'COLLAB:SERVER_UPDATE',
  }
  export type CollabAction = ICollabUsersChangedAction | ICollabEditAction | ICollabServerUpdateAction
  export interface ICollabUsersChangedAction {
    type: ECollabActionType.COLLAB_USERS_CHANGED
    payload: {
      userCount: number
      userId: string
    }
  }
  export interface ICollabEditPayload {
    version: number
    steps: { [key: string]: any }[] // toJSON'd PatchedStep
    clientIDs: number[]
  }
  export interface ICollabEditAction {
    type: ECollabActionType.COLLAB_CLIENT_EDIT
    payload: ICollabEditPayload
  }
  export interface ICollabServerUpdateAction {
    type: ECollabActionType.COLLAB_SERVER_UPDATE
    payload: INewStepsResponse
    payload: {
      cursors: any
    }
  }

  // Utils
  export const uuidv4: () => string
  export interface IError extends Error {
    statusCode?: number
  }
  export class APIError extends Error implements IError {
    statusCode: number
    constructor(message, errorCode = 500) {}
  }
}
