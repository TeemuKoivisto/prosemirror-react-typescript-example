import io from 'socket.io'
import { Server } from 'http'

import {
  IDBDocument, IUser,
  EActionType, IDocCreateAction, IDocDeleteAction, IDocLockAction
} from '@pm-react-example/shared'

import { collabDb } from './db/collab.db'

const usersMap: Map<string, IUser> = new Map()
let socket: io.Server | null = null

export const socketIO = {
  start(server: Server) {
    socket = new io.Server(server, {
      cors: {
        origin: '*',
      }
    })
    
    socket.on('connection', async (socket) => {
  
      const user: IUser = socket.handshake.auth.user
      socket['_user'] = user
      usersMap.set(user.id, user)

      // socket.emit('user:join', {
      //   usersCount: usersMap.size
      // })
  
      socket.on(EActionType.DOC_LOCK, (action: IDocLockAction) => {
        const { id } = socket['_user']
        const { payload: { documentId } } = action
        console.log(`user ${socket['_user'].id.slice(0, 5)} is editing doc ${documentId.slice(0, 5)}`)
        if (documentId) {
          collabDb.lockDoc(id, documentId)
        } else {
          collabDb.releaseDoc(id)
        }
      })
      socket.on('disconnect', () => {
        const { id } = socket['_user']
        usersMap.delete(id)
        collabDb.releaseDoc(id)
        // socket.emit('user:leave', {
        //   usersCount: usersMap.size
        // })
        // io.sockets.emit('getCount', io.sockets.adapter.rooms.get(documentId) === undefined ? 0 : io.sockets.adapter.rooms.get(documentId).size)
      })
    })
  },
  stop() {
    socket.close()
  },
  emitDocCreated(doc: IDBDocument, userId: string) {
    const action: IDocCreateAction = {
      type: EActionType.DOC_CREATE,
      payload: {
        doc,
        userId
      }
    }
    socket.emit(EActionType.DOC_CREATE, action)
  },
  emitDocDeleted(documentId: string, userId: string) {
    const action: IDocDeleteAction = {
      type: EActionType.DOC_DELETE,
      payload: {
        documentId,
        userId
      }
    }
    socket.emit(EActionType.DOC_DELETE, action)
  },
}
