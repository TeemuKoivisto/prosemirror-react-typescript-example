import {
  ECollabAction, ICollabUsersChangedAction, ICollabEditAction, ICollabEditPayload,
} from '@pm-react-example/shared'

export function createUsersChanged(documentId: string, userId: string, userCount: number) : ICollabUsersChangedAction {
  return {
    type: ECollabAction.COLLAB_USERS_CHANGED,
    payload: {
      documentId,
      userId,
      userCount
    },
  }
}

export function createEditDocument(documentId: string, payload: ICollabEditPayload) : ICollabEditAction {
  return {
    type: ECollabAction.COLLAB_CLIENT_EDIT,
    payload,
  }
}
