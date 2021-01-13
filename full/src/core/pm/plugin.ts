import { PluginKey as PMPluginKey } from 'prosemirror-state'

export class PluginKey extends PMPluginKey {
  readonly name: string
  constructor(name: string) {
    super(name)
    this.name = name
  }
}