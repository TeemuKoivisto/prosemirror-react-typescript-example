import { socketIO } from 'socket-io/socketIO'

import {
  EDocAction, IDBDocument, DocVisibility, IDocCreateAction, IDocDeleteAction, IDocVisibilityAction,
} from '@example/types'

export const documentIO = {
  emitDocCreated(doc: IDBDocument, userId: string) {
    const action: IDocCreateAction = {
      type: EDocAction.DOC_CREATE,
      payload: {
        doc,
        userId
      }
    }
    socketIO.emitToAll(action)
  },
  emitDocDeleted(documentId: string, userId: string) {
    const action: IDocDeleteAction = {
      type: EDocAction.DOC_DELETE,
      payload: {
        documentId,
        userId
      }
    }
    socketIO.emitToAll(action)
  },
  emitVisibilityChanged(documentId: string, visibility: DocVisibility, userId: string) {
    const action: IDocVisibilityAction = {
      type: EDocAction.DOC_VISIBILITY,
      payload: {
        documentId,
        visibility,
        userId
      }
    }
    socketIO.emitToAll(action)
  }
}