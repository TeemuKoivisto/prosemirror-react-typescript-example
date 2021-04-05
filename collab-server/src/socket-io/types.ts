import { Socket } from 'socket.io'
import {
  EActionType, IDocCreateAction, IDocDeleteAction, IDocSelectAction,
  ECollabActionType, ICollabUsersChangedAction, ICollabEditAction,
  ICollabServerUpdateAction
} from '@pm-react-example/shared'

export type ExampleAppSocket = Socket<ISocketListenEvents, ISocketEmitEvents>

export interface ISocketListenEvents {
  [EActionType.DOC_SELECT]: (action: IDocSelectAction) => void
}

export interface ISocketEmitEvents {
  [EActionType.DOC_CREATE]: (action: IDocCreateAction) => void
  [EActionType.DOC_DELETE]: (action: IDocDeleteAction) => void
  [ECollabActionType.COLLAB_USERS_CHANGED]: (action: ICollabUsersChangedAction) => void
  [ECollabActionType.COLLAB_CLIENT_EDIT]: (action: ICollabEditAction) => void
  [ECollabActionType.COLLAB_SERVER_UPDATE]: (action: ICollabServerUpdateAction) => void
}
