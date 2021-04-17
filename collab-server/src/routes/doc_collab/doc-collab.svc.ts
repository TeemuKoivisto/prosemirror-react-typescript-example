import { Step } from 'prosemirror-transform'
import { Node as PMNode } from 'prosemirror-model'

import { createDefaultSchema } from '@pm-react-example/full-v2'

import { CollaborativeInstance } from './CollaborativeInstance'
import { docDb } from '../../db/doc.db'
import { historyDb } from '../../db/history.db'
import { PatchedStep } from '@pm-react-example/shared'

const instancesMap = new Map<string, CollaborativeInstance>()
const schema = createDefaultSchema()
let savingTimeout: NodeJS.Timeout | null = null
let savedInstances = new Set<CollaborativeInstance>()

export const docCollabService = {
  createEmptyDoc() {
    return schema.nodeFromJSON(
      JSON.parse('{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a collaborative document!"}]}]}')
    )
  },
  evictInstance(docId: string) {
    instancesMap.delete(docId)
    historyDb.deleteHistory(docId)
  },
  getInstance(docId: string, userId: string) {
    if (instancesMap.has(docId)) {
      return instancesMap.get(docId)
    }
    let dbDoc = docDb.get(docId)
    let doc: PMNode
    if (!dbDoc) {
      doc = this.createEmptyDoc()
      dbDoc = docDb.add('Untitled', doc.toJSON(), userId)
    } else {
      doc = schema.nodeFromJSON(dbDoc.doc)
    }
    const oldHistory = historyDb.getHistory(docId)
    const newInstance = new CollaborativeInstance(doc, dbDoc.id, oldHistory)
    instancesMap.set(dbDoc.id, newInstance)
    return newInstance
  },
  appendToHistory(documentId: string, steps: PatchedStep[], version: number) {
    historyDb.addToHistory(documentId, steps, version)
  },
  saveInstance(inst: CollaborativeInstance) {
    if (!savedInstances.has(inst)) savedInstances.add(inst)
    if (savingTimeout) return
    savingTimeout = setTimeout(() => {
      savedInstances.forEach(ins => {
        const data = { doc: ins.doc.toJSON() }
        docDb.update(ins.documentId, data)
      })
      savedInstances = new Set()
      savingTimeout = null
    }, 2000)
  },
  parseSteps(steps: Step[]) {
    return steps.map(s => Step.fromJSON(schema, s))
  },
}
