import { Step } from 'prosemirror-transform'
import { Transaction } from 'prosemirror-state'

declare module '@pm-react-example/shared' {  

  // Utils
  export const uuidv4: () => string
  export interface IError extends Error {
    statusCode?: number
  }
  export class APIError extends Error implements IError {
    statusCode: number
    constructor(message, errorCode = 500) {}
  }

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

  // User
  export interface IUser {
    id: string
    name: string
  }

  // Document API
  export interface ICreateDocumentParams {
    title: string
    doc: PMDoc
    visibility: DocVisibility
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
}
