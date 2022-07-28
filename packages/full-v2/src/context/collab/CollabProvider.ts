import { getVersion, receiveTransaction, sendableSteps } from 'prosemirror-collab'
import { Step } from 'prosemirror-transform'
import { EditorState } from 'prosemirror-state'

import { APIProvider } from '../APIProvider'
import { EditorViewProvider } from '../EditorViewProvider'

import {
  ISaveCollabStepsParams,
  ECollabAction,
  ICollabUsersChangedAction,
  ICollabEditAction,
} from '@example/types'

import { replaceDocument, setCollab } from './replaceDocument'

interface Config {
  documentId: string
  userId: string
}

export class CollabProvider {
  isCollaborating = false
  config?: Config
  debounceTimeoutId: number | null = null
  apiProvider: APIProvider
  editorViewProvider: EditorViewProvider

  constructor(apiProvider: APIProvider, editorViewProvider: EditorViewProvider) {
    this.apiProvider = apiProvider
    this.editorViewProvider = editorViewProvider
  }

  get documentId() {
    return this.config?.documentId || ''
  }

  get userId() {
    return this.config?.userId || ''
  }

  get joinURL() {
    return `doc/${this.documentId}/join`
  }

  get leaveURL() {
    return `doc/${this.documentId}/leave`
  }

  get stepsURL() {
    return `doc/${this.documentId}/steps`
  }

  setConfig(config?: Config) {
    this.config = config
  }

  async joinCollabSession() {
    // TODO send current doc incase unsaved changes?
    try {
      const { version } = await this.apiProvider.post<any>(this.joinURL, { userId: this.userId })
      this.isCollaborating = true
      // this.editorViewProvider.execCommand(replaceDocument(doc, version))
      this.editorViewProvider.execCommand(setCollab(version))
      this.apiProvider.on(ECollabAction.COLLAB_USERS_CHANGED, this.onUsersChanged)
      this.apiProvider.on(ECollabAction.COLLAB_CLIENT_EDIT, this.onReceiveEdit)
      this.apiProvider.on(ECollabAction.COLLAB_SERVER_UPDATE, this.onReceiveServerUpdate)
    } catch (err) {
      console.error(err)
    }
  }

  async leaveCollabSession() {
    try {
      this.isCollaborating = false
      this.apiProvider.post<boolean>(this.leaveURL, { userId: this.userId })
      this.editorViewProvider.execCommand(setCollab(0))
      this.apiProvider.off(ECollabAction.COLLAB_USERS_CHANGED, this.onUsersChanged)
      this.apiProvider.off(ECollabAction.COLLAB_CLIENT_EDIT, this.onReceiveEdit)
      this.apiProvider.off(ECollabAction.COLLAB_SERVER_UPDATE, this.onReceiveServerUpdate)
    } catch (err) {
      console.error(err)
    }
  }

  //  send(tr: Transaction, _oldState: EditorState, newState: EditorState) {
  //   // Ignore transactions without steps
  //   if (!tr.steps || !tr.steps.length) {
  //     return;
  //   }
  //   this.channel.sendSteps(newState, this.getState);
  // }

  sendSteps(newState: EditorState) {
    const sendable = sendableSteps(newState)
    if (sendable) {
      const clientID = sendable.clientID as number
      const payload: ISaveCollabStepsParams = {
        version: sendable.version,
        steps: sendable.steps as Step[],
        origins: sendable.origins,
        clientID,
      }
      this.apiProvider.post(this.stepsURL, payload)
      // const { version } = await sendSteps({
      //   ...sendable,
      //   clientID,
      //   version: collabVersion
      // })
    }
    // const action: ICollabEditAction = {
    //   type: ECollabActionType.COLLAB_CLIENT_EDIT,
    //   payload: { ...params }
    // }
    // this.apiProvider.emit(this.URL, action)
  }

  // async sendSteps(state: any, getState: () => any, localSteps?: Array<Step>) {
  //   if (this.isSending) {
  //     this.debounceSendSteps(getState);
  //     return;
  //   }

  //   const version = getVersion(state);

  //   // Don't send any steps before we're ready.
  //   if (typeof version === undefined) {
  //     return;
  //   }

  //   const { steps }: { steps: Array<Step> } = localSteps ||
  //     (sendableSteps(state) as any) || { steps: [] }; // sendableSteps can return null..

  //   if (steps.length === 0) {
  //     logger(`No steps to send. Aborting.`);
  //     return;
  //   }

  //   this.isSending = true;
  // }

  sendCursorSelection() {}

  onUsersChanged = (action: ICollabUsersChangedAction) => {
    // umm update users info?
  }

  onReceiveEdit = (data: ICollabEditAction) => {
    const { editorView } = this.editorViewProvider
    const { state } = editorView
    const currentVersion = getVersion(state)
    const { version, steps, clientIDs } = data.payload
    const expectedVersion = currentVersion + steps.length
    if (version !== expectedVersion) {
      throw Error(`Version ${version} received when expected: ${expectedVersion}`)
    }
    const tr = receiveTransaction(
      state,
      steps.map((j) => Step.fromJSON(state.schema, j)),
      clientIDs
    )
    editorView.dispatch(tr)
  }

  onReceiveServerUpdate = () => {
    // receive cursors and whatnot? telepointers?? whatever they are..
  }

  destroy() {}
}
