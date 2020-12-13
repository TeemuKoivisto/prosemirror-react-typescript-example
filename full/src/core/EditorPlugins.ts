import { EditorView, NodeView } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import { MarkSpec, NodeSpec } from 'prosemirror-model';

import { EditorPlugin } from './types/editor-plugin'
import { EventDispatcher } from './utils/EventDispatcher'

interface PluginState {}

export class EditorPlugins {

  plugins: EditorPlugin[] = []
  // commands: EditorCommand[]
  dispatcher: EventDispatcher = new EventDispatcher()

  init(view: EditorView) {

  }

  notify(pluginKey: PluginKey, nextPluginState: PluginState) {

  }
}
