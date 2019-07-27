import * as React from 'react'
import * as PropTypes from 'prop-types'
import { EditorState, Transaction, Selection } from 'prosemirror-state'
import { EditorView, DirectEditorProps } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'
import { intlShape } from 'react-intl'
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next-types'
import { ProviderFactory, Transformer } from '@atlaskit/editor-common'

import { EventDispatcher, createDispatch } from '../event-dispatcher'
import { processRawValue } from '../utils'
import { findChangedNodesFromTransaction, validateNodes } from '../utils/nodes'
import createPluginList from './create-plugins-list'
import {
  analyticsEventKey,
  fireAnalyticsEvent,
  AnalyticsDispatch,
  AnalyticsEventPayload,
} from '../plugins/analytics'
import { EditorProps, EditorConfig, EditorPlugin } from '../types'
import { PortalProviderAPI } from '../ui/PortalProvider'
import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../plugins/editor-disabled'
import { analyticsService } from '../analytics'
import {
  processPluginsList,
  createSchema,
  createErrorReporter,
  createPMPlugins,
  initAnalytics,
} from './create-editor'
import { analyticsPluginKey } from '../plugins/analytics/plugin'
import { getDocStructure } from '../utils/document-logger'

export interface EditorViewProps {
  editorProps: EditorProps
  createAnalyticsEvent?: CreateUIAnalyticsEventSignature
  providerFactory: ProviderFactory
  portalProviderAPI: PortalProviderAPI
  allowAnalyticsGASV3?: boolean
  render?: (
    props: {
      editor: JSX.Element
      view?: EditorView
      config: EditorConfig
      eventDispatcher: EventDispatcher
      transformer?: Transformer<string>
      dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void
    },
  ) => JSX.Element
  onEditorCreated: (
    instance: {
      view: EditorView
      config: EditorConfig
      eventDispatcher: EventDispatcher
      transformer?: Transformer<string>
    },
  ) => void
  onEditorDestroyed: (
    instance: {
      view: EditorView
      config: EditorConfig
      eventDispatcher: EventDispatcher
      transformer?: Transformer<string>
    },
  ) => void
}

export default class ReactEditorView<T = {}> extends React.Component<
  EditorViewProps & T
> {
  view?: EditorView
  eventDispatcher: EventDispatcher
  contentTransformer?: Transformer<string>
  config: EditorConfig
  editorState: EditorState
  analyticsEventHandler: (
    payloadChannel: { payload: AnalyticsEventPayload; channel?: string },
  ) => void

  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    intl: intlShape,
  }

  constructor(props: EditorViewProps & T) {
    super(props)

    this.editorState = this.createEditorState({ props, replaceDoc: true })

    const { createAnalyticsEvent, allowAnalyticsGASV3 } = props
    if (allowAnalyticsGASV3) {
      this.activateAnalytics(createAnalyticsEvent)
    }

    this.eventDispatcher.emit(analyticsEventKey, {
      payload: {
        action: 'started',
        actionSubject: 'editor',
        attributes: { platform: 'web' },
        eventType: 'ui',
      },
    })
    initAnalytics(props.editorProps.analyticsHandler)
  }

  private broadcastDisabled = (disabled: boolean) => {
    const editorView = this.view
    if (editorView) {
      const tr = editorView.state.tr.setMeta(editorDisabledPluginKey, {
        editorDisabled: disabled,
      } as EditorDisabledPluginState)

      tr.setMeta('isLocal', true)
      editorView.dispatch(tr)
    }
  }

  componentWillReceiveProps(nextProps: EditorViewProps) {
    if (
      this.view &&
      this.props.editorProps.disabled !== nextProps.editorProps.disabled
    ) {
      this.broadcastDisabled(!!nextProps.editorProps.disabled)
      // Disables the contentEditable attribute of the editor if the editor is disabled
      this.view.setProps({
        editable: state => !nextProps.editorProps.disabled,
      } as DirectEditorProps)
    }

    // Activate or deactivate analytics if change property
    if (this.props.allowAnalyticsGASV3 !== nextProps.allowAnalyticsGASV3) {
      if (nextProps.allowAnalyticsGASV3) {
        this.activateAnalytics(nextProps.createAnalyticsEvent)
      } else {
        this.deactivateAnalytics()
      }
    } else {
      // Allow analytics is the same, check if we receive a new create analytics prop
      if (
        this.props.allowAnalyticsGASV3 &&
        nextProps.createAnalyticsEvent !== this.props.createAnalyticsEvent
      ) {
        this.deactivateAnalytics() // Deactivate the old one
        this.activateAnalytics(nextProps.createAnalyticsEvent) // Activate the new one
      }
    }
  }

  /**
   * Deactivate analytics event handler, if exist any.
   */
  deactivateAnalytics() {
    if (this.analyticsEventHandler) {
      this.eventDispatcher.off(analyticsEventKey, this.analyticsEventHandler)
    }
  }

  /**
   * Create analytics event handler, if createAnalyticsEvent exist
   * @param createAnalyticsEvent
   */
  activateAnalytics(createAnalyticsEvent?: CreateUIAnalyticsEventSignature) {
    if (createAnalyticsEvent) {
      this.analyticsEventHandler = fireAnalyticsEvent(createAnalyticsEvent)
      this.eventDispatcher.on(analyticsEventKey, this.analyticsEventHandler)
    }
  }

  /**
   * Clean up any non-PM resources when the editor is unmounted
   */
  componentWillUnmount() {
    this.eventDispatcher.destroy()

    if (this.view) {
      // Destroy the state if the Editor is being unmounted
      const editorState = this.view.state
      editorState.plugins.forEach(plugin => {
        const state = plugin.getState(editorState)
        if (state && state.destroy) {
          state.destroy()
        }
      })
    }
    // this.view will be destroyed when React unmounts in handleEditorViewRef
  }

  // Helper to allow tests to inject plugins directly
  getPlugins(
    editorProps: EditorProps,
    createAnalyticsEvent?: CreateUIAnalyticsEventSignature,
  ): EditorPlugin[] {
    return createPluginList(editorProps, createAnalyticsEvent)
  }

  createEditorState = (options: {
    props: EditorViewProps
    replaceDoc?: boolean
  }) => {
    if (this.view) {
      /**
       * There's presently a number of issues with changing the schema of a
       * editor inflight. A significant issue is that we lose the ability
       * to keep track of a user's history as the internal plugin state
       * keeps a list of Steps to undo/redo (which are tied to the schema).
       * Without a good way to do work around this, we prevent this for now.
       */
      // tslint:disable-next-line:no-console
      console.warn(
        'The editor does not support changing the schema dynamically.',
      )
      return this.editorState
    }

    this.config = processPluginsList(
      this.getPlugins(
        options.props.editorProps,
        options.props.createAnalyticsEvent,
      ),
      options.props.editorProps,
    )
    const schema = createSchema(this.config)

    const {
      contentTransformerProvider,
      defaultValue,
      errorReporterHandler,
    } = options.props.editorProps

    this.eventDispatcher = new EventDispatcher()
    const dispatch = createDispatch(this.eventDispatcher)
    const errorReporter = createErrorReporter(errorReporterHandler)

    const plugins = createPMPlugins({
      schema,
      dispatch,
      errorReporter,
      editorConfig: this.config,
      props: options.props.editorProps,
      eventDispatcher: this.eventDispatcher,
      providerFactory: options.props.providerFactory,
      portalProviderAPI: this.props.portalProviderAPI,
      reactContext: () => this.context,
    })

    this.contentTransformer = contentTransformerProvider
      ? contentTransformerProvider(schema)
      : undefined

    let doc
    if (options.replaceDoc) {
      doc =
        this.contentTransformer && typeof defaultValue === 'string'
          ? this.contentTransformer.parse(defaultValue)
          : processRawValue(schema, defaultValue)
    }
    let selection: Selection | undefined
    if (doc) {
      // ED-4759: Don't set selection at end for full-page editor - should be at start
      selection =
        options.props.editorProps.appearance === 'full-page'
          ? Selection.atStart(doc)
          : Selection.atEnd(doc)
    }
    // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error
    const patchedSelection = selection
      ? Selection.findFrom(selection.$head, -1, true) || undefined
      : undefined

    return EditorState.create({
      schema,
      plugins,
      doc,
      selection: patchedSelection,
    })
  }

  createEditorView = (node: HTMLDivElement) => {
    // Creates the editor-view from this.editorState. If an editor has been mounted
    // previously, this will contain the previous state of the editor.
    this.view = new EditorView(
      { mount: node },
      {
        state: this.editorState,
        dispatchTransaction: (transaction: Transaction) => {
          if (!this.view) {
            return
          }

          const nodes: PMNode[] = findChangedNodesFromTransaction(transaction)
          if (validateNodes(nodes)) {
            // go ahead and update the state now we know the transaction is good
            const editorState = this.view.state.apply(transaction)
            this.view.updateState(editorState)
            if (this.props.editorProps.onChange && transaction.docChanged) {
              this.props.editorProps.onChange(this.view)
            }
            this.editorState = editorState
          } else {
            const documents = {
              new: getDocStructure(transaction.doc),
              prev: getDocStructure(transaction.docs[0]),
            }
            analyticsService.trackEvent(
              'atlaskit.fabric.editor.invalidtransaction',
              { documents: JSON.stringify(documents) }, // V2 events don't support object properties
            )
            this.eventDispatcher.emit(analyticsEventKey, {
              payload: {
                action: 'dispatchedInvalidTransaction',
                actionSubject: 'editor',
                eventType: 'operational',
                attributes: {
                  analyticsEventPayloads: transaction.getMeta(
                    analyticsPluginKey,
                  ),
                  documents,
                },
              },
            })
          }
        },
        // Disables the contentEditable attribute of the editor if the editor is disabled
        editable: state => !this.props.editorProps.disabled,
        attributes: { 'data-gramm': 'false' },
      },
    )
  }

  handleEditorViewRef = (node: HTMLDivElement) => {
    if (!this.view && node) {
      this.createEditorView(node)
      this.props.onEditorCreated({
        view: this.view!,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      })

      // Set the state of the EditorDisabled plugin to the current value
      this.broadcastDisabled(!!this.props.editorProps.disabled)

      // Force React to re-render so consumers get a reference to the editor view
      this.forceUpdate()
    } else if (this.view && !node) {
      // When the appearance is changed, React will call handleEditorViewRef with node === null
      // to destroy the old EditorView, before calling this method again with node === div to
      // create the new EditorView
      this.props.onEditorDestroyed({
        view: this.view,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      })
      this.view.destroy() // Destroys the dom node & all node views
      this.view = undefined
    }
  }

  dispatchAnalyticsEvent = (payload: AnalyticsEventPayload): void => {
    if (this.props.allowAnalyticsGASV3 && this.eventDispatcher) {
      const dispatch: AnalyticsDispatch = createDispatch(this.eventDispatcher)
      dispatch(analyticsEventKey, {
        payload,
      })
    }
  }

  render() {
    const editor = <div key="ProseMirror" ref={this.handleEditorViewRef} />
    return this.props.render
      ? this.props.render({
          editor,
          view: this.view,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
          transformer: this.contentTransformer,
          dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
        })
      : editor
  }
}
