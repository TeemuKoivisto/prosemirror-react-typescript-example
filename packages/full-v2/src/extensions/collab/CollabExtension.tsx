import { EditorState } from 'prosemirror-state'
import { collab } from 'prosemirror-collab'

import { Extension } from '../Extension'

// import { collabEditPluginFactory } from './pm-plugins/main'
import { collabEditPluginKey, getPluginState } from './pm-plugins/state'

export type CollabExtensionProps = {
  documentId?: string
  userId?: string
}

export class CollabExtension extends Extension<CollabExtensionProps> {
  get name() {
    return 'collab' as const
  }

  static get pluginKey() {
    return collabEditPluginKey
  }

  static getPluginState(state: EditorState) {
    return getPluginState(state)
  }

  get plugins() {
    return [
      { name: 'pmCollab', plugin: () => collab() },
      // {
      //   name: 'collab',
      //   plugin: () => collabEditPluginFactory(this.ctx, this.props),
      // },
    ]
  }

  onPropsChanged(props: CollabExtensionProps) {
    const { documentId, userId } = props
    const { collabProvider } = this.ctx
    const propsChanged = this.props?.documentId !== documentId || this.props?.userId !== userId
    if (!propsChanged) {
      return
    }
    if (collabProvider.isCollaborating) {
      collabProvider.leaveCollabSession()
      collabProvider.setConfig()
    }
    this.props = props
    if (documentId && userId) {
      collabProvider.setConfig({ documentId, userId })
      collabProvider.joinCollabSession()
    }
  }
}
