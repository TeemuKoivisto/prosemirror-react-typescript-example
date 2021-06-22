import { socketIO } from 'src/socket-io/socketIO'

import {
  ECollabAction, ICollabUsersChangedAction, ICollabEditAction, ICollabEditPayload,
} from '@pm-react-example/shared/collab-socket'

export const docCollabIO = {
  emitCollabUsersChanged(documentId: string, userId: string, userCount: number) {
    const action: ICollabUsersChangedAction = {
      type: ECollabAction.COLLAB_USERS_CHANGED,
      payload: {
        documentId,
        userId,
        userCount
      },
    }
    socketIO.emitToRoom(action, documentId)
  },
  emitEditDocument(documentId: string, payload: ICollabEditPayload) {
    const action: ICollabEditAction = {
      type: ECollabAction.COLLAB_CLIENT_EDIT,
      payload,
    }
    socketIO.emitToRoom(action, documentId)
  },
}