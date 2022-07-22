import { PluginKey, EventDispatcher } from '@core'

interface PluginState {
  [key: string]: any
}

export class PluginsProvider {

  dispatcher: EventDispatcher = new EventDispatcher()

  publish(pluginKey: PluginKey, nextPluginState: PluginState) {
    this.dispatcher.emit(pluginKey.name, nextPluginState)
  }

  subscribe(pluginKey: PluginKey, cb: (data: any) => void) {
    this.dispatcher.on(pluginKey.name, cb)
  }

  unsubscribe(pluginKey: PluginKey, cb: (data: any) => void) {
    this.dispatcher.off(pluginKey.name, cb)
  }
}
