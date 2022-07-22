import { ECollabAction } from '../src'

export { ECollabAction } from '../src'

export type EditorSocketAction = CollabAction
export type EditorSocketActionType = ECollabAction

// Collab actions
// REMEMBER: when adding enums, update the shared.js file

export type CollabAction = ICollabUsersChangedAction | ICollabEditAction | ICollabServerUpdateAction
export interface ICollabUsersChangedAction {
  type: ECollabAction.COLLAB_USERS_CHANGED
  payload: {
    documentId: string
    userCount: number
    userId: string
  }
}
export interface ICollabEditPayload {
  version: number
  steps: { [key: string]: any }[]
  clientIDs: number[]
}
export interface ICollabEditAction {
  type: ECollabAction.COLLAB_CLIENT_EDIT
  payload: ICollabEditPayload
}
export interface ICollabServerUpdateAction {
  type: ECollabAction.COLLAB_SERVER_UPDATE
  payload: {
    cursors: any
  }
}