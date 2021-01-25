import { EditorState, Plugin } from 'prosemirror-state'
import { PluginKey } from '../../../core/pm'

import { PortalProvider } from '../../../react/portals'
import { PluginsProvider } from '../../../core'
import { CommandDispatch } from '../../../core/types'

import { getActiveMarks } from '../pm-utils/getActive'

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

export function basePluginFactory(
  portalProvider: PortalProvider,
  pluginsProvider: PluginsProvider,
  options?: {},
) {
  return new Plugin({
    state: {
      init(_, state): BaseState {
        return {
          activeNodes: [],
          activeMarks: [],
        }
      },
      apply(
        tr,
        pluginState: BaseState,
        _oldState,
        newState,
      ): BaseState {
        if (tr.docChanged || tr.selectionSet) {
          const marks = getActiveMarks(newState)
          const eqMarks = marks.every(m => pluginState.activeMarks.includes(m)) && marks.length === pluginState.activeMarks.length
          if (!eqMarks) {
            const nextPluginState = {
              ...pluginState,
              activeMarks: marks,
            }
            pluginsProvider.publish(basePluginKey, nextPluginState)
            return nextPluginState
          }
        }

        return pluginState
      },
    },
    key: basePluginKey,
    props: {
    },
  })
}
