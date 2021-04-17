import { action, computed, observable, makeObservable, reaction } from 'mobx'
import io from 'socket.io-client'

import { AuthStore } from './AuthStore'
import { DocumentStore } from './DocumentStore'
import { ToastStore } from './ToastStore'

import { APIProvider } from '@pm-react-example/full-v2'
import {
  EDocAction, IDocCreateAction, IDocDeleteAction, IDocVisibilityAction
} from '@pm-react-example/shared'

const {
  REACT_APP_API_URL = 'http://localhost:3400'
} = process.env

interface IProps {
  authStore: AuthStore
  documentStore: DocumentStore
  toastStore: ToastStore
}

export class SyncStore {

  @observable socket: SocketIOClient.Socket | null = null
  @observable syncEnabled: boolean = false

  apiProvider: APIProvider
  authStore: AuthStore
  documentStore: DocumentStore
  toastStore: ToastStore

  constructor(props: IProps) {
    makeObservable(this)
    this.authStore = props.authStore
    this.documentStore = props.documentStore
    this.toastStore = props.toastStore
    // this.watchCurrentDocument()
  }

  // watchCurrentDocument = () => {
  //   reaction(
  //     () => this.documentStore.currentDocument,
  //     currentDocument => {
  //       this.emitSelectedDoc(currentDocument?.id)
  //     }
  //   )
  // }

  @computed get isDisconnected() {
    return this.syncEnabled && this.socket?.disconnected
  }

  initAPIProvider = () => {
    this.apiProvider.init({
      API_URL: REACT_APP_API_URL,
      getAuthorization: () => `User ${this.authStore.user?.id}`,
      socket: this.socket
    })
  }

  @action setAPIProvider = (apiProvider: APIProvider) => {
    this.apiProvider = apiProvider
    this.initAPIProvider()
  }

  @action toggleSyncing = (documentId: string) => {
    if (this.socket !== null) {
      this.socket?.close()
      this.socket = null
      this.syncEnabled = false
      return
    }

    this.documentStore.getDocuments()

    this.syncEnabled = true
    this.socket = io(REACT_APP_API_URL, {
      reconnectionDelayMax: 10000,
      auth: {
        user: this.authStore.user,
        // add JWT here for real authentication
      },
      query: {
        documentId
      }
    })
    this.initAPIProvider()
    this.socket.on(EDocAction.DOC_CREATE, (action: IDocCreateAction) => {
      this.documentStore.receiveUpdate(action, action.payload.userId === this.authStore.user?.id)
    })
    this.socket.on(EDocAction.DOC_DELETE, (action: IDocDeleteAction) => {
      this.documentStore.receiveUpdate(action, action.payload.userId === this.authStore.user?.id)
    })
    this.socket.on(EDocAction.DOC_VISIBILITY, (action: IDocVisibilityAction) => {
      this.documentStore.receiveUpdate(action, action.payload.userId === this.authStore.user?.id)
    })
  }

  @action reset = () => {
    this.socket?.close()
    this.socket = null
  }
}
