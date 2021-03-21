import { Node as PMNode } from 'prosemirror-model'

export interface IDBDocument {
  id: string
  title: string
  doc: PMNode
}
