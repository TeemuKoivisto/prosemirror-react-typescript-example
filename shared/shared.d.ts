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

  // Utils
  export const uuidv4: () => string
}
