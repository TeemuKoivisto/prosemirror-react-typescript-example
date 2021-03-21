import fs from 'fs/promises'
import { Node as PMNode } from 'prosemirror-model'
import { IDBDocument } from '../../types/document'

export class DB {
  nextId: number = 1
  docsMap: Map<number, IDBDocument> = new Map()

  constructor(parseDoc: (data: any) => PMNode) {
    fs.readFile('./data.json', 'utf-8').then(data => {
      const parsed: [number, IDBDocument][] = JSON.parse(data)
      parsed.forEach(mapValue => {
        this.docsMap.set(mapValue[0], {
          id: mapValue[0],
          doc: parseDoc(mapValue[1]),
        })
      })
    })
  }

  get(id: number) {
    return this.docsMap.get(id)
  }

  getAll() {
    return Array.from(this.docsMap.entries())
  }

  add(doc: PMNode) {
    const id = this.nextId++
    this.docsMap.set(id, { id, doc })
    this.write()
    return { id, doc }
  }

  update(id: number, doc: PMNode) {
    this.docsMap.set(id, { id, doc })
    this.write()
  }

  write() {
    fs.writeFile('./data.json', JSON.stringify(Array.from(this.docsMap.entries())))
  }
}
