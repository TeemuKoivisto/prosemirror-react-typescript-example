import io from 'socket.io'
import { Server } from 'http'

import { IDBDocument } from '@pm-react-example/shared'
import { IUser } from './types/user'

const usersMap: Map<number, IUser> = new Map()
let socket: io.Server | null = null

export const socketIO = {
  start(server: Server) {
    socket = new io.Server(server, {
      cors: {
        origin: '*',
      }
    })
    
    socket.on('connection', async (socket) => {
      console.log('asdf', socket.handshake.query)
      // usersMap.set()
      socket.on('doc:update', async (payload) => {
        console.log('doc:update ', payload)
      })
      socket.on('disconnect', () => {
        console.log('disconnect')
        socket.emit('user:leave', {
          usersCount: usersMap.size
        })
        // io.sockets.emit('getCount', io.sockets.adapter.rooms.get(documentId) === undefined ? 0 : io.sockets.adapter.rooms.get(documentId).size)
      })
    })
  },
  stop() {
    socket.close()
  },
  emitDocCreated(doc: IDBDocument) {
    socket.emit('doc:created', {
      doc
    })
  },
  emitDocDeleted(documentId: string) {
    socket.emit('doc:deleted', {
      documentId
    })
  },
}

