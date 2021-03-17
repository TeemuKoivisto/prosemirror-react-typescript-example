import { Step } from 'prosemirror-transform'
import { Node as PMNode } from 'prosemirror-model'

import { createDefaultSchema } from '@pm-react-example/full'

import { CollaborativeInstance } from './CollaborativeInstance'
import { DB } from './DB'

const DBInstance = new DB()
const instancesMap = new Map<number, CollaborativeInstance>()
const schema = createDefaultSchema()
let savingTimeout: NodeJS.Timeout | null = null

export const docService = {
  createEmptyDoc() {
    const doc = PMNode.fromJSON(schema,
      JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a collaborative document!"}]}]}')
    )
    return DBInstance.add(doc)
  },
  getInstance(docId: number) {
    if (instancesMap.has(docId)) {
      return instancesMap.get(docId)
    }
    let doc = DBInstance.get(docId)
    if (!doc) doc = this.createEmptyDoc()
    const newInstance = new CollaborativeInstance(doc)
    instancesMap.set(doc.id, newInstance)
    return newInstance
  },
  saveInstance(inst: CollaborativeInstance) {
    if (savingTimeout) return
    savingTimeout = setTimeout(() => {
      DBInstance.update(inst.documentId, inst.doc)
      savingTimeout = null
    }, 5000)
  },
  parseSteps(steps: Step[]) {
    return steps.map(s => Step.fromJSON(schema, s))
  },
}
