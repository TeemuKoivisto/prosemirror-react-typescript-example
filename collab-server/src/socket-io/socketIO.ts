import io from 'socket.io'
import { Server } from 'http'

import {
  IDBDocument, IUser, PatchedStep,
  EActionType, IDocCreateAction, IDocDeleteAction,
  ECollabActionType, ICollabUsersChangedAction, ICollabEditAction, ICollabServerUpdateAction
} from '@pm-react-example/shared'

import { collabDb } from '../db/collab.db'

import { ISocketListenEvents, ISocketEmitEvents } from './types'
import { docEvents } from './doc.events'

const usersMap: Map<string, IUser> = new Map()
let ioServer: io.Server<ISocketListenEvents, ISocketEmitEvents> | null = null

export const socketIO = {
  start(server: Server) {
    ioServer = new io.Server<ISocketListenEvents, ISocketEmitEvents>(server, {
      cors: {
        origin: '*',
      }
    })
    
    ioServer.on('connection', async (socket) => {
  
      const user: IUser = socket.handshake.auth.user
      socket['_user'] = user
      usersMap.set(user.id, user)

      // socket.emit('user:join', {
      //   usersCount: usersMap.size
      // })
  
      docEvents(socket)

      socket.on('disconnect', () => {
        const { id } = socket['_user']
        usersMap.delete(id)
        collabDb.unselectDoc(id)
        // socket.emit('user:leave', {
        //   usersCount: usersMap.size
        // })
        // io.sockets.emit('getCount', io.sockets.adapter.rooms.get(documentId) === undefined ? 0 : io.sockets.adapter.rooms.get(documentId).size)
      })
    })
  },
  stop() {
    ioServer.close()
  },
  emitDocCreated(doc: IDBDocument, userId: string) {
    const action: IDocCreateAction = {
      type: EActionType.DOC_CREATE,
      payload: {
        doc,
        userId
      }
    }
    ioServer.emit(EActionType.DOC_CREATE, action)
  },
  emitDocDeleted(documentId: string, userId: string) {
    const action: IDocDeleteAction = {
      type: EActionType.DOC_DELETE,
      payload: {
        documentId,
        userId
      }
    }
    ioServer.emit(EActionType.DOC_DELETE, action)
  },
  emitCollabUsersChanged(userId: string, userCount: number, documentId: string) {
    const action: ICollabUsersChangedAction = {
      type: ECollabActionType.COLLAB_USERS_CHANGED,
      payload: {
        userId,
        userCount
      },
    }
    ioServer.emit(ECollabActionType.COLLAB_USERS_CHANGED, action)
  },
  emitEditDocument(version: number, steps: PatchedStep[]) {
    const action: ICollabEditAction = {
      type: ECollabActionType.COLLAB_CLIENT_EDIT,
      payload: {
        version,
        steps,
      },
    }
    ioServer.emit(ECollabActionType.COLLAB_CLIENT_EDIT, action)
  }
}
