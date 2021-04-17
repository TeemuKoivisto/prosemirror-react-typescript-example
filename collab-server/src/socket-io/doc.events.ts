import {
  EDocAction, IDocVisibilityAction
} from '@pm-react-example/shared'

import { collabDb } from '../db/collab.db'

import { ExampleAppSocket } from './types'

export const docEvents = (socket: ExampleAppSocket) => {
  // TODO change to presence / cursor
  // socket.on(EActionType.DOC_SELECT, (action: IDocSelectAction) => {
  //   const userId = socket['_user'].id
  //   const { payload: { documentId } } = action
  //   const oldDocId = collabDb.getUsersSelectedDocId(userId)
  //   console.log(`user ${userId.slice(0, 5)} is editing doc ${documentId.slice(0, 5)}`)
  //   if (documentId) {
  //     collabDb.selectDoc(userId, documentId, false)
  //     socket.join(documentId)
  //   } else {
  //     collabDb.unselectDoc(userId)
  //   }
  //   socket.leave(oldDocId)
  // })
}