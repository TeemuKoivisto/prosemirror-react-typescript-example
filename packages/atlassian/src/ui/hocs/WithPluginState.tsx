import React from 'react'
import { PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import PropTypes from 'prop-types'

import { createDispatch, EventDispatcher } from '../../utils/event-dispatcher'
import { EditorActions } from '../../EditorActions'

import { EditorConfig } from '../../types'

export interface State {
  [name: string]: any
}

export type PluginsConfig = { [name: string]: PluginKey }
export type Context = {
  editorActions?: EditorActions
  editorConfig?: EditorConfig
}

export interface Props {
  eventDispatcher?: EventDispatcher
  editorView?: EditorView
  plugins: PluginsConfig
  render: (pluginsState: any) => React.ReactElement<any> | null
}

/**
 * Wraps component in a high order component that watches state changes of given plugins
 * and passes those states to the wrapped component.
 *
 * Example:
 * <WithPluginState
 *   eventDispatcher={eventDispatcher}
 *   editorView={editorView}
 *   plugins={{
 *     hyperlink: hyperlinkPluginKey
 *   }}
 *   render={renderComponent}
 * />
 *
 * renderComponent: ({ hyperlink }) => React.Component;
 */
export default class WithPluginState extends React.Component<Props, State> {
  static displayName = 'WithPluginState'

  private listeners = {}
  private debounce: number | null = null
  private notAppliedState = {}
  private isSubscribed = false

  static contextTypes = {
    editorActions: PropTypes.object,
    editorConfig: PropTypes.object,
  }

  state = {}
  context!: Context

  constructor(props: Props, context: Context) {
    super(props)
    this.state = this.getPluginsStates(props.plugins, this.getEditorView(props, context))
  }

  private getEditorView(maybeProps?: Props, maybeContext?: Context): EditorView | undefined {
    const props = maybeProps || this.props
    const context = maybeContext || this.context
    return (
      props.editorView ||
      (context && context.editorActions && context.editorActions._privateGetEditorView())
    )
  }

  private getEventDispatcher(maybeProps?: Props): EventDispatcher | undefined {
    const props = maybeProps || this.props
    return (
      props.eventDispatcher ||
      (this.context &&
        this.context.editorActions &&
        this.context.editorActions._privateGetEventDispatcher())
    )
  }

  private handlePluginStateChange =
    (propName: string, pluginName: string, skipEqualityCheck?: boolean) => (pluginState: any) => {
      // skipEqualityCheck is being used for old plugins since they are mutating plugin state instead of creating a new one
      if ((this.state as any)[propName] !== pluginState || skipEqualityCheck) {
        this.updateState({
          stateSubset: { [propName]: pluginState },
          pluginName,
        })
      }
    }

  /**
   * Debounces setState calls in order to reduce number of re-renders caused by several plugin state changes.
   */
  private updateState = ({
    stateSubset,
    pluginName,
  }: {
    stateSubset: State
    pluginName: string
  }) => {
    this.notAppliedState = { ...this.notAppliedState, ...stateSubset }
    if (this.debounce) {
      window.clearTimeout(this.debounce)
    }
    this.debounce = window.setTimeout(() => {
      this.setState(this.notAppliedState)
      this.debounce = null
      this.notAppliedState = {}
    }, 0)
  }

  private getPluginsStates(plugins: { [name: string]: PluginKey }, editorView?: EditorView) {
    if (!editorView || !plugins) {
      return {}
    }

    return Object.keys(plugins).reduce<Record<string, any>>((acc, propName) => {
      const pluginKey = plugins[propName]
      if (!pluginKey) {
        return acc
      }
      acc[propName] = pluginKey.getState(editorView.state)
      return acc
    }, {})
  }

  private subscribe(props: Props): void {
    const plugins = props.plugins
    const eventDispatcher = this.getEventDispatcher(props)
    const editorView = this.getEditorView(props)

    if (!eventDispatcher || !editorView || this.isSubscribed) {
      return
    }

    this.isSubscribed = true

    const pluginsStates = this.getPluginsStates(plugins, editorView)
    this.setState(pluginsStates)

    Object.keys(plugins).forEach((propName) => {
      const pluginKey = plugins[propName]
      if (!pluginKey) {
        return
      }

      const pluginName = (pluginKey as any).key
      const pluginState = (pluginsStates as any)[propName]
      const isPluginWithSubscribe = pluginState && pluginState.subscribe
      const handler = this.handlePluginStateChange(propName, pluginName, isPluginWithSubscribe)

      if (isPluginWithSubscribe) {
        pluginState.subscribe(handler)
      } else {
        eventDispatcher.on((pluginKey as any).key, handler)
      }

      ;(this.listeners as any)[(pluginKey as any).key] = { handler, pluginKey }
    })
  }

  private unsubscribe() {
    const eventDispatcher = this.getEventDispatcher()
    const editorView = this.getEditorView()

    if (!eventDispatcher || !editorView || !this.isSubscribed) {
      return
    }

    Object.keys(this.listeners).forEach((key) => {
      const pluginState = (this.listeners as any)[key].pluginKey.getState(editorView.state)

      if (pluginState && pluginState.unsubscribe) {
        pluginState.unsubscribe((this.listeners as any)[key].handler)
      } else {
        eventDispatcher.off(key, (this.listeners as any)[key].handler)
      }
    })

    this.listeners = []
  }

  private onContextUpdate = () => {
    this.subscribe(this.props)
  }

  private subscribeToContextUpdates(context?: Context) {
    if (context && context.editorActions) {
      context.editorActions._privateSubscribe(this.onContextUpdate)
    }
  }

  private unsubscribeFromContextUpdates(context?: Context) {
    if (context && context.editorActions) {
      context.editorActions._privateUnsubscribe(this.onContextUpdate)
    }
  }

  componentDidMount() {
    this.subscribe(this.props)
    this.subscribeToContextUpdates(this.context)
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!this.isSubscribed) {
      this.subscribe(nextProps)
    }
  }

  componentWillUnmount() {
    if (this.debounce) {
      window.clearTimeout(this.debounce)
    }
    this.unsubscribeFromContextUpdates(this.context)
    this.unsubscribe()
  }

  render() {
    const { render } = this.props
    return render(this.state)
  }
}
