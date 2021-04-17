import {
  IDBDocument, DocVisibility,
  EDocAction, IDocCreateAction, IDocDeleteAction, IDocVisibilityAction,
} from '@pm-react-example/shared'

export function createDocCreated(doc: IDBDocument, userId: string) : IDocCreateAction {
  return {
    type: EDocAction.DOC_CREATE,
    payload: {
      doc,
      userId
    }
  }
}

export function createDocDeleted(documentId: string, userId: string) : IDocDeleteAction {
  return {
    type: EDocAction.DOC_DELETE,
    payload: {
      documentId,
      userId
    }
  }
}

export function createVisibilityChanged(documentId: string, visibility: DocVisibility, userId: string) : IDocVisibilityAction {
  return {
    type: EDocAction.DOC_VISIBILITY,
    payload: {
      documentId,
      visibility,
      userId
    }
  }
}
