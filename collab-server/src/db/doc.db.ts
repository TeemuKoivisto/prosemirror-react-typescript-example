import fs from 'fs/promises'

import { IDBDocument, PMDoc, DocVisibility, uuidv4 } from '@pm-react-example/shared'

interface StoredData {
  docsMap: [string, IDBDocument][]
}

class DocDB {

  docsMap: Map<string, IDBDocument> = new Map()
  FILE = './doc.db.json'

  constructor() {
    this.read()
  }

  add(title: string, doc: PMDoc, userId: string, visibility: DocVisibility = 'private') {
    const id = uuidv4()
    const dbDoc: IDBDocument = { id, title, doc, userId, visibility }
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
    let parsed: StoredData
    try {
      parsed = data ? JSON.parse(data) : {}
    } catch (err) {
      console.error(err)
      exists && fs.unlink(this.FILE)
    }
    parsed?.docsMap?.forEach(mapValue => {
      this.docsMap.set(mapValue[0], {
        id: mapValue[0],
        title: mapValue[1].title,
        userId: mapValue[1].userId,
        doc: mapValue[1].doc,
        visibility: mapValue[1].visibility,
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
