import { Step } from 'prosemirror-transform'

import { createDefaultSchema } from '@pm-react-example/full'

import { CollaborativeInstance } from './CollaborativeInstance'
import { docDb } from '../../db/doc.db'

const instancesMap = new Map<string, CollaborativeInstance>()
const schema = createDefaultSchema()
let savingTimeout: NodeJS.Timeout | null = null

export const docEventService = {
  createEmptyDoc() {
    return schema.nodeFromJSON(
      JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a collaborative document!"}]}]}')
    )
  },
  getInstance(docId: string) {
    if (instancesMap.has(docId)) {
      return instancesMap.get(docId)
    }
    let dbDoc = docDb.get(docId)
    let doc
    if (!dbDoc) {
      doc = this.createEmptyDoc()
      dbDoc = docDb.add('Untitled', doc.toJSON())
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
      docDb.update(inst.documentId, data)
      savingTimeout = null
    }, 5000)
  },
  parseSteps(steps: Step[]) {
    return steps.map(s => Step.fromJSON(schema, s))
  },
}
