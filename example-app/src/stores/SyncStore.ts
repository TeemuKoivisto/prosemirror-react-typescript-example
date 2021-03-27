import { action, computed, observable, makeObservable } from 'mobx'
import io from 'socket.io-client'

import { DocumentStore } from './DocumentStore'
import { ToastStore } from './ToastStore'

const {
  REACT_APP_SOCKET_IO_URL = 'http://localhost:3400'
} = process.env

export class SyncStore {

  @observable syncDocs: boolean = false
  socket: SocketIOClient.Socket | null = null

  docStore: DocumentStore
  toastStore: ToastStore

  constructor(docStore: DocumentStore, toastStore: ToastStore) {
    makeObservable(this)
    this.docStore = docStore
    this.toastStore = toastStore
  }

  @computed get syncEnabled() {
    return this.socket !== null
  }

  @action toggleSyncing = () => {
    if (this.socket !== null) {
      this.socket?.close()
      this.socket = null
      return
    }

    this.docStore.getDocuments()

    this.socket = io(REACT_APP_SOCKET_IO_URL, {
      reconnectionDelayMax: 10000,
      auth: {
        token: '123'
      },
      query: {
        'my-key': 'my-value'
      }
    })
    this.socket.on('doc:created', (data: any) => {
      console.log('doc:created!', data)
      // this.docStore.addDoc
      this.toastStore.createToast('Received document created')
    })
    this.socket.on('doc:deleted', (data: any) => {
      console.log('deleted ', data)
      // this.docStore.deleteDoc
      this.toastStore.createToast('Received document deleted', 'danger')
    })
  }

  @action disconnectSocket = () => {
    this.socket?.close()
  }
}
