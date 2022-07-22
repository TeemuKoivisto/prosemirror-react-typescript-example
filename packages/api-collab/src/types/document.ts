import { Step } from 'prosemirror-transform'

export type PatchedStep = Step & { clientID: number }
