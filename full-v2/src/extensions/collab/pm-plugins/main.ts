import { Plugin } from 'prosemirror-state'
import { DecorationSet } from 'prosemirror-view'

import { EditorContext } from '@context'

import { CollabState, collabEditPluginKey, getPluginState } from './state'
import { CollabExtensionProps } from '..'
import { CollabParticipant } from '../types'

export function collabEditPluginFactory(
  ctx: EditorContext,
  props: CollabExtensionProps,
) {
  return new Plugin({
    state: {
      init(_, state): CollabState {
        return {
          decorations: DecorationSet.create(state.doc, []),
          participants: new Map<string, CollabParticipant>(),
          isCollabInitialized: false
        }
      },
      apply(
        tr,
        pluginState: CollabState,
        _oldState,
        newState,
      ): CollabState {
        return pluginState
      },
    },
    key: collabEditPluginKey,
    props: {
      decorations(this: Plugin, state) {
        return this.getState(state).decorations
      },
    },
    filterTransaction(tr, state) {
      // TODO 28.3.2021: not sure is this whole block needed 
      const pluginState = getPluginState(state)
      const isCollabInitialized = tr.getMeta('collabInitialized')

      // Don't allow transactions that modifies the document before
      // collab-plugin is ready.
      if (isCollabInitialized) {
        return true
      }

      if (!pluginState.isCollabInitialized && tr.docChanged) {
        return false
      }

      return true
    },
    view(view) {
      return {
        destroy() {}
      }
    }
    // view(view) {
    //   const addErrorAnalytics = addSynchronyErrorAnalytics(
    //     view.state,
    //     view.state.tr,
    //   )

    //   const cleanup = collabProviderCallback(
    //     initialize({ view, options, providerFactory }),
    //     addErrorAnalytics,
    //   )

    //   return {
    //     destroy() {
    //       providerFactory.unsubscribeAll('collabEditProvider')
    //       if (cleanup) {
    //         cleanup.then(unsubscribe => {
    //           if (unsubscribe) {
    //             unsubscribe()
    //           }
    //         })
    //       }
    //     },
    //   }
    // },
  })
}
