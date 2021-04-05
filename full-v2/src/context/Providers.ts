import { ExtensionProvider} from './ExtensionProvider'
import { EditorViewProvider } from './EditorViewProvider'
import { PluginsProvider } from './PluginsProvider'
import { PortalProvider } from '@react'
import { AnalyticsProvider } from './analytics/AnalyticsProvider'
import { APIProvider } from './APIProvider'
import { CollabProvider } from './collab/CollabProvider'

export interface IProviders {
  analyticsProvider: AnalyticsProvider
  apiProvider: APIProvider
  collabProvider: CollabProvider
  extensionProvider: ExtensionProvider
  pluginsProvider: PluginsProvider
  portalProvider: PortalProvider
  viewProvider: EditorViewProvider
}

export const createDefaultProviders = () : IProviders => {
  const analyticsProvider = new AnalyticsProvider()
  const apiProvider = new APIProvider()
  const extensionProvider = new ExtensionProvider()
  const pluginsProvider = new PluginsProvider()
  const portalProvider = new PortalProvider()
  const viewProvider = new EditorViewProvider()
  const collabProvider = new CollabProvider(apiProvider, viewProvider)
  return {
    analyticsProvider,
    apiProvider,
    extensionProvider,
    pluginsProvider,
    portalProvider,
    viewProvider,
    collabProvider
  }
}
