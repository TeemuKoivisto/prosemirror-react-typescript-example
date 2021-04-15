import fs from 'fs/promises'

import { DocVisibility } from '@pm-react-example/shared'

interface StoredData {
  editedDocs: [string, EditedDoc][]
}
type EditedDoc = {
  users: string[]
  ownerId: string
  visibility: 'private' | 'global'
}

class CollabDB {

  editedDocs = new Map<string, EditedDoc>()
  FILE = './collab.db.json'

  constructor() {
    this.read()
  }

  canUserEdit(userId: string, documentId: string) {
    const editedDoc = this.editedDocs.get(documentId)
    return editedDoc && (editedDoc.visibility === 'global' || editedDoc.ownerId === userId)
  }

  isUserOwner(userId: string, documentId: string) {
    const editedDoc = this.editedDocs.get(documentId)
    return editedDoc && editedDoc.ownerId === userId
  }

  startEditing(userId: string, documentId: string, visibility = 'private' as DocVisibility) {
    const doc = this.editedDocs.get(documentId)
    if (!doc) {
      this.editedDocs.set(documentId, {
        users: [userId],
        ownerId: userId,
        visibility,
      })
    } else if (doc.ownerId === userId && doc.visibility === 'private') {
      // Resuming an editing session on their private document
      this.editedDocs.set(documentId, {
        users: [userId],
        ownerId: userId,
        visibility: 'global',
      })
    } else if (doc.visibility === 'global') {
      // Joining a collab session on a global document
      const { users } = doc
      const updatedUsers = users.includes(userId) ? users : [...users, userId]
      this.editedDocs.set(documentId, { ...doc, users: updatedUsers })
    }
    this.write()
  }

  leaveDocument(userId: string, documentId?: string) {
    if (!documentId) {
      Array.from(this.editedDocs.entries()).forEach(([docId, doc]) => {
        if (doc.users.includes(userId)) {
          this.editedDocs.set(docId, { ...doc, users: doc.users.filter(id => id !== userId) })
        }
      })
      this.write()
    }
    const doc = documentId && this.editedDocs.get(documentId)
    if (doc) {
      this.editedDocs.set(documentId, { ...doc, users: doc.users.filter(id => id !== userId) })
      this.write()
    }
  }

  setDocumentVisibility(userId: string, documentId: string, visibility: DocVisibility) {
    const doc = this.editedDocs.get(documentId)
    if (doc && doc.ownerId === userId) {
      const disableAccess = visibility === 'private'
      const users = disableAccess ? [userId] : doc.users
      this.editedDocs.set(documentId, { ...doc, users, visibility })
      this.write()
      return true
    }
    return false
  }

  async read() {
    const exists = await fs.access(this.FILE).then(() => true).catch(() => false)
    const data = exists ? await fs.readFile(this.FILE, 'utf-8') : undefined
    const parsed: StoredData = data ? JSON.parse(data) : {}
    parsed?.editedDocs?.forEach(mapValue => {
      this.editedDocs.set(mapValue[0], mapValue[1])
    })
  }

  write() {
    const data: StoredData = {
      editedDocs: Array.from(this.editedDocs.entries()),
    }
    fs.writeFile(this.FILE, JSON.stringify(data))
  }
}

export const collabDb = new CollabDB()
