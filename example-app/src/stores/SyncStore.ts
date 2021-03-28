import { action, computed, observable, makeObservable, reaction } from 'mobx'
import io from 'socket.io-client'

import { AuthStore } from './AuthStore'
import { DocumentStore } from './DocumentStore'
import { ToastStore } from './ToastStore'

import {
  EActionType, IDocCreateAction, IDocDeleteAction, IDocLockAction
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

  authStore: AuthStore
  documentStore: DocumentStore
  toastStore: ToastStore

  constructor(props: IProps) {
    makeObservable(this)
    this.authStore = props.authStore
    this.documentStore = props.documentStore
    this.toastStore = props.toastStore
    this.watchCurrentDocument()
  }

  watchCurrentDocument = () => {
    reaction(
      () => this.documentStore.currentDocument,
      currentDocument => {
        this.emitSelectedDoc(currentDocument?.id)
      }
    )
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

    this.documentStore.getDocuments()

    this.socket = io(REACT_APP_API_URL, {
      reconnectionDelayMax: 10000,
      auth: {
        user: this.authStore.user,
        // add JWT here for real authentication
      },
      query: {
        'my-key': 'my-value'
      }
    })
    this.socket.on(EActionType.DOC_CREATE, (action: IDocCreateAction) => {
      this.documentStore.receiveUpdate(action, action.payload.userId === this.authStore.user?.id)
    })
    this.socket.on(EActionType.DOC_DELETE, (action: IDocDeleteAction) => {
      this.documentStore.receiveUpdate(action, action.payload.userId === this.authStore.user?.id)
    })
  }

  @action emitSelectedDoc = (documentId?: string) => {
    const action: IDocLockAction = {
      type: EActionType.DOC_LOCK,
      payload: {
        documentId
      }
    }
    this.socket?.emit(EActionType.DOC_LOCK, action)
  }

  @action reset = () => {
    this.socket?.close()
    this.socket = null
  }
}
