import io from 'socket.io'
import { Server } from 'http'

import {
  IDBDocument, IUser, PatchedStep,
  EActionType, IDocCreateAction, IDocDeleteAction,
  ECollabActionType, ICollabUsersChangedAction, ICollabEditAction, ICollabEditPayload
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

      const { documentId } = socket.handshake.query
      if (documentId) {
        socket.join(documentId)
      }
      socket.join('all')
  
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
  addUserToDocumentRoom(userId: string, documentId: string) {
    console.log(ioServer.sockets.adapter.rooms)
    // console.log(ioServer.sockets)
    ioServer.socketsJoin(documentId)
  },
  emitDocCreated(doc: IDBDocument, userId: string) {
    const action: IDocCreateAction = {
      type: EActionType.DOC_CREATE,
      payload: {
        doc,
        userId
      }
    }
    ioServer.in('all').emit(EActionType.DOC_CREATE, action)
  },
  emitDocDeleted(documentId: string, userId: string) {
    const action: IDocDeleteAction = {
      type: EActionType.DOC_DELETE,
      payload: {
        documentId,
        userId
      }
    }
    ioServer.in('all').emit(EActionType.DOC_DELETE, action)
  },
  emitCollabUsersChanged(documentId: string, userId: string, userCount: number) {
    const action: ICollabUsersChangedAction = {
      type: ECollabActionType.COLLAB_USERS_CHANGED,
      payload: {
        userId,
        userCount
      },
    }
    const room = ioServer.sockets.adapter.rooms[documentId]
    console.log(room)
    ioServer.in(documentId).emit(ECollabActionType.COLLAB_USERS_CHANGED, action)
  },
  emitEditDocument(documentId: string, payload: ICollabEditPayload) {
    const action: ICollabEditAction = {
      type: ECollabActionType.COLLAB_CLIENT_EDIT,
      payload,
    }
    const room = ioServer.sockets.adapter.rooms[documentId]
    console.log(room)
    ioServer.in(documentId).emit(ECollabActionType.COLLAB_CLIENT_EDIT, action)
  }
}
