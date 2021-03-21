import { Node as PMNode } from 'prosemirror-model'

export type PMDoc = {
  [key: string]: any
}
export interface IDBDocument {
  id: string
  title: string
  doc: PMDoc
}
