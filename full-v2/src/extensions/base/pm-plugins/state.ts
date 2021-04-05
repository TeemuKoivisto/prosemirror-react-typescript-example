import { EditorState } from 'prosemirror-state'
import { PluginKey } from '@core'
import { CommandDispatch } from '@core'

export interface BaseState {
  activeNodes: string[]
  activeMarks: string[]
}

export const basePluginKey = new PluginKey('basePlugin')

export const getPluginState = (state: EditorState): BaseState =>
  basePluginKey.getState(state)

export const setPluginState = (stateProps: Object) => (
  state: EditorState,
  dispatch: CommandDispatch,
): boolean => {
  const pluginState = getPluginState(state)
  dispatch(
    state.tr.setMeta(basePluginKey, {
      ...pluginState,
      ...stateProps,
    }),
  )
  return true
}