import { Extension, createSchema, createPlugins } from '@extensions'

export class ExtensionProvider {

  extensions: Set<Extension<any>> = new Set()

  register(extension: Extension<any>) {
    this.extensions.add(extension)
  }

  unregister(extension: Extension<any>) {
    this.extensions.delete(extension)
  }

  createSchema() {
    return createSchema(Array.from(this.extensions.values()))
  }

  createPlugins() {
    return createPlugins(Array.from(this.extensions.values()))
  }
}
