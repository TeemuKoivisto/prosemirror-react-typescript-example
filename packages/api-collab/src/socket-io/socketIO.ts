import io from 'socket.io'
import { Server } from 'http'

import { CollabAction, DocAction, IUser } from '@example/types'

import { collabDb } from 'db/collab.db'

import { ISocketListenEvents, ISocketEmitEvents } from './types'

const usersMap: Map<string, IUser> = new Map()
let ioServer: io.Server<ISocketListenEvents, ISocketEmitEvents> | null = null

export const socketIO = {
  start(server: Server) {
    ioServer = new io.Server<ISocketListenEvents, ISocketEmitEvents>(server, {
      cors: {
        origin: '*',
      },
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
  async addUserToRoom(userId: string, documentId: string) {
    const sockets = await ioServer.in('all').fetchSockets()
    for (const socket of sockets) {
      if (socket['_user']?.id === userId) {
        socket.join(documentId)
      }
    }
  },
  async removeUserFromRoom(userId: string, documentId: string) {
    const sockets = await ioServer.in(documentId).fetchSockets()
    for (const socket of sockets) {
      if (socket['_user']?.id === userId) {
        socket.leave(documentId)
      }
    }
  },
  emitToAll(action: DocAction | CollabAction) {
    // TODO 22-6-2021 fix types here or just use any instead of ISocketEmitEvents
    // @ts-ignore
    ioServer.in('all').emit(action.type, action)
  },
  emitToRoom(action: DocAction | CollabAction, roomId: string) {
    // @ts-ignore
    ioServer.in(roomId).emit(action.type, action)
  },
}
