import fs from 'fs/promises'

import { IDBDocument, PMDoc, uuidv4 } from '@pm-react-example/shared'

interface StoredData {
  docsMap: [string, IDBDocument][]
}

class DocDB {

  docsMap: Map<string, IDBDocument> = new Map()
  FILE = './doc.db.json'

  constructor() {
    this.read()
  }

  add(title: string, doc: PMDoc, collab = false) {
    const id = uuidv4()
    const dbDoc = { id, title, doc, collab }
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
    const exists = await fs.access(this.FILE).then(() => true).catch(() => false)
    const data = exists ? await fs.readFile(this.FILE, 'utf-8') : undefined
    const parsed: StoredData = data ? JSON.parse(data) : []
    parsed?.docsMap?.forEach(mapValue => {
      this.docsMap.set(mapValue[0], {
        id: mapValue[0],
        title: mapValue[1].title,
        doc: mapValue[1].doc,
        collab: mapValue[1].collab,
      })
    })
  }

  write() {
    const data: StoredData = {
      docsMap: Array.from(this.docsMap.entries())
    }
    fs.writeFile(this.FILE, JSON.stringify(data))
  }
}

export const docDb = new DocDB()
