import fs from 'fs/promises'

interface StoredData {
  lockedDocs: [string, string][]
}

class CollabDB {

  lockedDocs = new Map<string, string>()
  FILE = './collab.db.json'

  constructor() {
    this.read()
  }

  lockDoc(userId: string, documentId: string) {
    this.lockedDocs.delete(userId)
    const currentLockedDocs = Array.from(this.lockedDocs.values())
    if (!currentLockedDocs.includes(documentId)) {
      this.lockedDocs.set(userId, documentId)
      this.write()
    }
  }

  releaseDoc(userId: string) {
    this.lockedDocs.delete(userId)
    this.write()
  }

  isLocked(userId: string, documentId: string) {
    return this.lockedDocs.get(userId) !== documentId
  }

  async read() {
    const exists = await fs.access(this.FILE).then(() => true).catch(() => false)
    const data = exists ? await fs.readFile(this.FILE, 'utf-8') : undefined
    const parsed: StoredData = data ? JSON.parse(data) : {}
    parsed?.lockedDocs?.forEach(mapValue => {
      this.lockedDocs.set(mapValue[0], mapValue[1])
    })
  }

  write() {
    const data: StoredData = {
      lockedDocs: Array.from(this.lockedDocs.entries())
    }
    fs.writeFile(this.FILE, JSON.stringify(data))
  }
}

export const collabDb = new CollabDB()
