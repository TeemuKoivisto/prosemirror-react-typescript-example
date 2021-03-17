import { Node as PMNode } from 'prosemirror-model'
import { Step } from 'prosemirror-transform'

export interface IDBDocument {
  id: number
  doc: PMNode
}

export type PatchedStep = Step & { clientID: number }
