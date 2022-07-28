import { Plugin } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'

// TODO: Check if this circular dependency is still needed or is just legacy
// eslint-disable-next-line import/no-cycle
import { EditorConfig } from './editor-config'
import { Dispatch, EventDispatcher } from '../utils/event-dispatcher'
import { PortalProviderAPI } from '../react-portals/PortalProviderAPI'
import { ProviderFactory } from '../provider-factory'

export type PMPluginFactoryParams = {
  schema: Schema
  dispatch: Dispatch
  eventDispatcher: EventDispatcher
  providerFactory: ProviderFactory
  portalProviderAPI: PortalProviderAPI
}

export type PMPluginCreateConfig = PMPluginFactoryParams & {
  editorConfig: EditorConfig
}

export type PMPluginFactory = (params: PMPluginFactoryParams) => Plugin | undefined

export type PMPlugin = {
  name: string
  plugin: PMPluginFactory
}
