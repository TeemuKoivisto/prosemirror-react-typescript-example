import io from 'socket.io'
import { Server } from 'http'

import {
  IDBDocument, IUser,
  EDocAction, ECollabAction, ICollabEditPayload, DocVisibility
} from '@pm-react-example/shared'

import { collabDb } from '../db/collab.db'

import { ISocketListenEvents, ISocketEmitEvents } from './types'
// import { docEvents } from './doc.events'
import * as docActions from './doc.actions'
import * as collabActions from './collab.actions'

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
  
      // docEvents(socket)

      socket.on('disconnect', () => {
        const { id } = socket['_user']
        usersMap.delete(id)
        collabDb.leaveDocument(id)
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
  async addUserToDocumentRoom(userId: string, documentId: string) {
    const sockets = await ioServer.in('all').fetchSockets()
    for (const socket of sockets) {
      if (socket['_user']?.id === userId) {
        socket.join(documentId)
      }
    }
  },
  async removeUserFromDocumentRoom(userId: string, documentId: string) {
    const sockets = await ioServer.in(documentId).fetchSockets()
    for (const socket of sockets) {
      if (socket['_user']?.id === userId) {
        socket.leave(documentId)
      }
    }
  },
  emitDocCreated(doc: IDBDocument, userId: string) {
    const action = docActions.createDocCreated(doc, userId)
    ioServer.in('all').emit(EDocAction.DOC_CREATE, action)
  },
  emitDocDeleted(documentId: string, userId: string) {
    const action = docActions.createDocDeleted(documentId, userId)
    ioServer.in('all').emit(EDocAction.DOC_DELETE, action)
  },
  emitDocVisibilityChanged(documentId: string, visibility: DocVisibility, userId: string) {
    const action = docActions.createVisibilityChanged(documentId, visibility, userId)
    ioServer.in('all').emit(EDocAction.DOC_VISIBILITY, action)
  },
  emitCollabUsersChanged(documentId: string, userId: string, userCount: number) {
    // const room = ioServer.sockets.adapter.rooms[documentId]
    const action = collabActions.createUsersChanged(documentId, userId, userCount)
    ioServer.in(documentId).emit(ECollabAction.COLLAB_USERS_CHANGED, action)
  },
  emitEditDocument(documentId: string, payload: ICollabEditPayload) {
    const action = collabActions.createEditDocument(documentId, payload)
    ioServer.in(documentId).emit(ECollabAction.COLLAB_CLIENT_EDIT, action)
  },
}
