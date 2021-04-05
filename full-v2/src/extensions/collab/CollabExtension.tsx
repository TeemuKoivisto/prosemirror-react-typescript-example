import { EditorState } from 'prosemirror-state'
import { collab } from 'prosemirror-collab'

import { Extension } from '../Extension'

// import { collabEditPluginFactory } from './pm-plugins/main'
import { collabEditPluginKey, getPluginState } from './pm-plugins/state'

export interface CollabExtensionProps {
  documentId: string
  userId: string
}

export class CollabExtension extends Extension<CollabExtensionProps> {

  get name() {
    return 'collab' as const
  }

  static get pluginKey() {
    return collabEditPluginKey
  }

  static getPluginState(state: EditorState) {
    getPluginState(state)
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
    const { collabProvider } = this.ctx
    const propsChanged = this.props.documentId !== props.documentId || this.props.userId !== props.userId
    if (propsChanged && collabProvider.isCollaborating) {
      collabProvider.leaveCollabSession()
    }
    this.props = props
    collabProvider.setConfig(props)
    if (propsChanged) {
      collabProvider.joinCollabSession()
    }
  }
}
