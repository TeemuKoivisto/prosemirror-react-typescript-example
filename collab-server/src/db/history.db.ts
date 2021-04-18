import fs from 'fs/promises'

import { PatchedStep } from '@pm-react-example/shared'

interface StoredData {
  docHistories: [string, DocHistory][]
}
export type DocHistory = {
  steps: PatchedStep[]
  version: number
}

class HistoryDB {

  docHistories = new Map<string, DocHistory>()
  FILE = './history.db.json'

  constructor() {
    this.read()
  }

  addToHistory(documentId: string, steps: PatchedStep[], version: number) {
    const doc = this.docHistories.get(documentId)
    const newSteps = doc ? [...doc.steps, ...steps] : steps
    this.docHistories.set(documentId, { steps: newSteps, version })
    this.write()
  }

  deleteHistory(documentId: string) {
    this.docHistories.delete(documentId)
  }

  getHistory(documentId: string) : DocHistory | undefined {
    return this.docHistories.get(documentId)
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
    parsed?.docHistories?.forEach(mapValue => {
      this.docHistories.set(mapValue[0], mapValue[1])
    })
  }

  write() {
    const data: StoredData = {
      docHistories: Array.from(this.docHistories.entries()),
    }
    fs.writeFile(this.FILE, JSON.stringify(data))
  }
}

export const historyDb = new HistoryDB()
