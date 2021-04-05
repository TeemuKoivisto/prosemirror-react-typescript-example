import { Step } from 'prosemirror-transform'
import { Node as PMNode } from 'prosemirror-model'

import { IDBDocument, PatchedStep, IJoinResponse } from '@pm-react-example/shared'

const MAX_STEP_HISTORY = 10000

export class CollaborativeInstance {

  doc: PMNode
  documentId: string
  steps: PatchedStep[] = []
  currentVersion: number = 0
  lastActive: number = Date.now()
  users: Set<string> = new Set()

  constructor(doc: PMNode, documentId: string) {
    this.doc = doc
    this.documentId = documentId
  }

  get currentDocument() : IJoinResponse {
    return {
      doc: this.doc.toJSON(),
      steps: this.steps,
      version: this.currentVersion,
      userCount: this.users.size,
    }
  }

  isValidVersion(version: number) {
    return version >= 0 && version <= this.currentVersion
  }

  applySteps(steps: Step[], clientID: number) {
    let doc = this.doc
    // const maps = []
    const patchedSteps: PatchedStep[] = []

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i] as PatchedStep
      step.clientID = clientID
      const result = step.apply(doc)
      if (result.doc) doc = result.doc
      // maps.push(step.getMap())
      patchedSteps.push(step)
    }
    this.doc = doc
    this.currentVersion += patchedSteps.length
    this.steps = this.steps.concat(patchedSteps)

    if (this.steps.length > MAX_STEP_HISTORY) {
      this.steps = this.steps.slice(this.steps.length - MAX_STEP_HISTORY)
    }
    return patchedSteps
  }

  handleReceiveSteps(version: number, steps: Step[], clientID: number) {
    if (!this.isValidVersion(version)) throw Error(`Invalid version: ${version} with currentVersion ${this.currentVersion}`)
    if (this.currentVersion !== version) return false
    return {
      steps: this.applySteps(steps, clientID),
      version: this.currentVersion,
    }
  }

  handleUserJoin(userId: string) {
    this.users.add(userId)
  }

  handleUserLeave(userId: string) {
    this.users.delete(userId)
  }
}