import { Plugin } from 'prosemirror-state'
import { IExtension, ExtensionPlugin } from './Extension'

export function createPlugins(extensions: IExtension<any>[]) {
  const plugins = extensions.reduce((acc, cur) => [...acc, ...cur.plugins], [] as ExtensionPlugin[])
  return plugins.reduce((acc, p) => [...acc, p.plugin()], [] as Plugin[])
}
