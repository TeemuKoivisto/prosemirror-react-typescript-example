import fs from 'fs/promises'
import { Node as PMNode } from 'prosemirror-model'

import { IDBDocument, uuidv4 } from '@pm-react-example/shared'

export class DB {
  docsMap: Map<string, IDBDocument> = new Map()

  constructor(parseDoc: (data: any) => PMNode) {
    this.read(parseDoc)
  }

  get(id: string) {
    return this.docsMap.get(id)
  }

  getAll() {
    return Array.from(this.docsMap.entries()).map(([_id, d]) => d)
  }

  add(title: string, doc: PMNode) {
    const id = uuidv4()
    const dbDoc = { id, title, doc: doc.toJSON() }
    this.docsMap.set(id, dbDoc)
    this.write()
    return dbDoc
  }

  update(id: string, data: Partial<IDBDocument>) {
    const old = this.docsMap.get(id)
    this.docsMap.set(id, { ...old, ...data })
    this.write()
  }

  async read(parseDoc: (data: any) => PMNode) {
    const exists = await fs.access('./data.json').then(() => true).catch(() => false)
    const data = exists ? await fs.readFile('./data.json', 'utf-8') : undefined
    const parsed: [string, IDBDocument][] = data ? JSON.parse(data) : []
    parsed.forEach(mapValue => {
      this.docsMap.set(mapValue[0], {
        id: mapValue[0],
        title: mapValue[1].title,
        doc: parseDoc(mapValue[1].doc),
      })
    })
  }

  write() {
    fs.writeFile('./data.json', JSON.stringify(Array.from(this.docsMap.entries())))
  }
}
