import { Socket } from 'socket.io'
import {
  EDocAction, IDocCreateAction, IDocDeleteAction, IDocVisibilityAction,
} from '@pm-react-example/shared/doc-socket'
import {
  ECollabAction, ICollabUsersChangedAction, ICollabEditAction,
  ICollabServerUpdateAction
} from '@pm-react-example/shared/collab-socket'

export type ExampleAppSocket = Socket<ISocketListenEvents, ISocketEmitEvents>

export interface ISocketListenEvents {
}

export interface ISocketEmitEvents {
  [EDocAction.DOC_CREATE]: (action: IDocCreateAction) => void
  [EDocAction.DOC_DELETE]: (action: IDocDeleteAction) => void
  [EDocAction.DOC_VISIBILITY]: (action: IDocVisibilityAction) => void
  [ECollabAction.COLLAB_USERS_CHANGED]: (action: ICollabUsersChangedAction) => void
  [ECollabAction.COLLAB_CLIENT_EDIT]: (action: ICollabEditAction) => void
  [ECollabAction.COLLAB_SERVER_UPDATE]: (action: ICollabServerUpdateAction) => void
}
