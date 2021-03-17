import { Step } from 'prosemirror-transform'
import { Node as PMNode } from 'prosemirror-model'

import { IDBDocument, PatchedStep } from '../../types/document'

const MAX_STEP_HISTORY = 10000

export class CollaborativeInstance {

  currentVersion: number = 0
  doc: PMNode
  documentId: number
  steps: PatchedStep[] = []
  lastActive: number = Date.now()
  users: {[ip: string]: boolean} = {}
  userCount: number = 0
  pendingRequests: { [ip: string]: {
    onDocChanges(): void
  }} = {}
  collectingTimeoutId: NodeJS.Timeout | null = null

  constructor(document: IDBDocument) {
    this.doc = document.doc
    this.documentId = document.id
  }

  addPendingRequest(ip: string, onDocChanges: () => void) {
    this.pendingRequests[ip] = {
      onDocChanges
    }
  }

  removePendingRequest(ip: string) {
    delete this.pendingRequests[ip]
  }

  sendUpdates() {
    for (const ip in this.pendingRequests) {
      this.pendingRequests[ip].onDocChanges()
    }
    this.pendingRequests = {}
  }

  addEvents(version: number, steps: Step[], clientID: number) {
    this.checkVersion(version)
    if (this.currentVersion != version) return false
    let doc = this.doc
    const maps = []

    const patchedSteps: PatchedStep[] = []

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i] as PatchedStep
      step.clientID = clientID
      let result = step.apply(doc)
      if (result.doc) doc = result.doc
      maps.push(step.getMap())
      patchedSteps.push(step)
    }
    this.doc = doc
    this.currentVersion += patchedSteps.length
    this.steps = this.steps.concat(patchedSteps)

    if (this.steps.length > MAX_STEP_HISTORY) {
      this.steps = this.steps.slice(this.steps.length - MAX_STEP_HISTORY)
    }

    return {
      version: this.currentVersion,
      // cursors: this.getCursors(user)
    };
  }

  getEvents(version: number) {
    this.checkVersion(version)
    const startIndex = this.steps.length - (this.currentVersion - version)
    if (startIndex < 0) {
      return null
    }
    return {
      steps: this.steps.slice(startIndex),
      users: this.userCount
    }
  }

  checkVersion(version: number) {
    const isVersionValid = version >= 0 && version <= this.currentVersion
    if (!isVersionValid) {
      throw Error(`Invalid version: ${version} with currentVersion ${this.currentVersion}`)
    }
  }

  registerUser(ip: string) {
    if (!(ip in this.users)) {
      this.users[ip] = true
      this.userCount++
      if (this.collectingTimeoutId == null) {
        this.collectingTimeoutId = setTimeout(() => this.collectUsers(), 5000)
      }
    }
  }

  collectUsers() {
    const oldUserCount = this.userCount
    this.users = Object.create(null)
    this.userCount = 0
    this.collectingTimeoutId = null
    for (const ip in this.pendingRequests) {
      this.registerUser(ip)
    }
    if (this.userCount != oldUserCount) this.sendUpdates()
  }
}
