import fs from 'fs/promises'

interface StoredData {
  editedDocs: [string, EditedDoc][]
  selectedDocs: [string, string][]
}
type EditedDoc = {
  users: string[]
  collab: boolean
}
class CollabDB {

  editedDocs = new Map<string, EditedDoc>()
  selectedDocs = new Map<string, string>()
  FILE = './collab.db.json'

  constructor() {
    this.read()
  }

  canUserEdit(userId: string, documentId: string) {
    const editedDoc = this.editedDocs.get(documentId)
    return !editedDoc || editedDoc.users.includes(userId) || editedDoc.collab
  }

  /**
   * User either creates a document or selects it from the UI
   * @param userId 
   * @param documentId 
   * @param collab 
   */
  selectDoc(userId: string, documentId: string, collab: boolean) {
    const oldEditedDocId = this.selectedDocs.get(userId)
    if (oldEditedDocId !== documentId) {
      const oldEditedDoc = this.editedDocs.get(oldEditedDocId)
      if (oldEditedDoc) {
        const users = oldEditedDoc.users.filter(id => id === userId)
        this.editedDocs.set(oldEditedDocId, { ...oldEditedDoc, users })
      }
      this.selectedDocs.delete(userId)
    }
    const editedDoc = this.editedDocs.get(documentId)
    const canUserEdit = !editedDoc || editedDoc.users.includes(userId) || editedDoc.collab
    if (canUserEdit && editedDoc?.collab) {
      // join collab session
      const users = [...editedDoc.users, userId]
      this.editedDocs.set(documentId, { users, collab: true })
    } else if (canUserEdit) {
      // start private or collab editing session
      this.editedDocs.set(documentId, { users: [userId], collab })
    }
    // Select the doc even if user can't edit it as to only release its previously locked doc
    this.selectedDocs.set(userId, documentId)
    this.write()
  }

  /**
   * The user somehow leaves the document
   * @param userId 
   */
  unselectDoc(userId: string) {
    const oldEditedDocId = this.selectedDocs.get(userId)
    const oldEditedDoc = this.editedDocs.get(oldEditedDocId)
    if (oldEditedDocId && oldEditedDoc) {
      const users = oldEditedDoc.users.filter(id => id === userId)
      this.editedDocs.set(oldEditedDocId, { ...oldEditedDoc, users })
      this.selectedDocs.delete(userId)
      this.write()
    }
  }

  /**
   * User presses collab button on a doc they've already selected
   * @param userId 
   * @param documentId 
   */
  setCollab(userId: string, documentId: string, collab: boolean) {
    const editedDocId = this.selectedDocs.get(userId)
    const editedDoc = this.editedDocs.get(documentId)
    let action: 'disable-collab' | 'start-collab' | undefined
    if (editedDocId !== documentId) {
      // Somehow they have managed to select another doc, probably in another tab
      // while keeping this doc open and then toggling OR they are just messing with the API
    } else if (editedDoc.collab && !collab) {
      // Make the doc private, disable collab and kick everyone else out
      this.editedDocs.set(documentId, { users: [userId], collab })
      action = 'disable-collab'
    } else if (!editedDoc.collab && collab) {
      // Start collab session
      this.editedDocs.set(documentId, { users: [userId], collab })
      action = 'start-collab'
    }
    this.write()
    return action
  }

  async read() {
    const exists = await fs.access(this.FILE).then(() => true).catch(() => false)
    const data = exists ? await fs.readFile(this.FILE, 'utf-8') : undefined
    const parsed: StoredData = data ? JSON.parse(data) : {}
    parsed?.editedDocs?.forEach(mapValue => {
      this.editedDocs.set(mapValue[0], mapValue[1])
    })
    parsed?.selectedDocs?.forEach(mapValue => {
      this.selectedDocs.set(mapValue[0], mapValue[1])
    })
  }

  write() {
    const data: StoredData = {
      editedDocs: Array.from(this.editedDocs.entries()),
      selectedDocs: Array.from(this.selectedDocs.entries()),
    }
    fs.writeFile(this.FILE, JSON.stringify(data))
  }
}

export const collabDb = new CollabDB()
