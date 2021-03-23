import { Step } from 'prosemirror-transform'

import { createDefaultSchema } from '@pm-react-example/full'

import { CollaborativeInstance } from './CollaborativeInstance'
import { DB } from './DB'

const DBInstance = new DB((data: any) => schema.nodeFromJSON(data.doc))
const instancesMap = new Map<string, CollaborativeInstance>()
const schema = createDefaultSchema()
let savingTimeout: NodeJS.Timeout | null = null

export const docService = {
  createEmptyDoc() {
    return schema.nodeFromJSON(
      JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a collaborative document!"}]}]}')
    )
  },
  getDocuments() {
    return DBInstance.getAll()
  },
  getInstance(docId: string) {
    if (instancesMap.has(docId)) {
      return instancesMap.get(docId)
    }
    let dbDoc = DBInstance.get(docId)
    let doc
    if (!dbDoc) {
      doc = this.createEmptyDoc()
      dbDoc = DBInstance.add('Untitled', doc)
    } else {
      doc = schema.nodeFromJSON(dbDoc)
    }
    const newInstance = new CollaborativeInstance(doc, dbDoc.id)
    instancesMap.set(dbDoc.id, newInstance)
    return newInstance
  },
  saveInstance(inst: CollaborativeInstance) {
    if (savingTimeout) return
    savingTimeout = setTimeout(() => {
      const data = { doc: inst.doc.toJSON() }
      DBInstance.update(inst.documentId, data)
      savingTimeout = null
    }, 5000)
  },
  parseSteps(steps: Step[]) {
    return steps.map(s => Step.fromJSON(schema, s))
  },
}
