import {
  EActionType, IDocLockAction
} from '@pm-react-example/shared'

import { collabDb } from '../db/collab.db'

import { ExampleAppSocket } from './types'

export const docEvents = (socket: ExampleAppSocket) => {
  socket.on(EActionType.DOC_LOCK, (action: IDocLockAction) => {
    const userId = socket['_user'].id
    const { payload: { documentId } } = action
    console.log(`user ${userId.slice(0, 5)} is editing doc ${documentId.slice(0, 5)}`)
    if (documentId) {
      collabDb.selectDoc(userId, documentId, false)
    } else {
      collabDb.unselectDoc(userId)
    }
  })
}