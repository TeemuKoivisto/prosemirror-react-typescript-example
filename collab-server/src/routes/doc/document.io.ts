import { socketIO } from 'socket-io/socketIO'

import { IDBDocument, DocVisibility } from '@pm-react-example/shared'
import {
  EDocAction, IDocCreateAction, IDocDeleteAction, IDocVisibilityAction,
} from '@pm-react-example/shared/doc-socket'

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