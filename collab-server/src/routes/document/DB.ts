import { Node as PMNode } from 'prosemirror-model'
import { IDBDocument } from '../../types/document'

export class DB {
  nextId: number = 1
  docsMap: Map<number, IDBDocument> = new Map()

  get(id: number) {
    return this.docsMap.get(id)
  }

  add(doc: PMNode) {
    const id = this.nextId++
    this.docsMap.set(id, { id, doc })
    return { id, doc }
  }

  update(id: number, doc: PMNode) {
    this.docsMap.set(id, { id, doc })
  }
}
