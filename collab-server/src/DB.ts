import fs from 'fs/promises'

import { IDBDocument, PMDoc, uuidv4 } from '@pm-react-example/shared'

export class DB {
  docsMap: Map<string, IDBDocument> = new Map()

  constructor() {
    this.read()
  }

  add(title: string, doc: PMDoc) {
    const id = uuidv4()
    const dbDoc = { id, title, doc }
    this.docsMap.set(id, dbDoc)
    this.write()
    return dbDoc
  }

  get(id: string) {
    return this.docsMap.get(id)
  }

  getAll() {
    return Array.from(this.docsMap.entries()).map(([_id, d]) => d)
  }

  update(id: string, data: Partial<IDBDocument>) {
    const old = this.docsMap.get(id)
    this.docsMap.set(id, { ...old, ...data })
    this.write()
  }

  delete(id: string) {
    this.docsMap.delete(id)
    this.write()
  }

  async read() {
    const exists = await fs.access('./data.json').then(() => true).catch(() => false)
    const data = exists ? await fs.readFile('./data.json', 'utf-8') : undefined
    const parsed: [string, IDBDocument][] = data ? JSON.parse(data) : []
    parsed.forEach(mapValue => {
      this.docsMap.set(mapValue[0], {
        id: mapValue[0],
        title: mapValue[1].title,
        doc: mapValue[1].doc
      })
    })
  }

  write() {
    fs.writeFile('./data.json', JSON.stringify(Array.from(this.docsMap.entries())))
  }
}

export const db = new DB()
