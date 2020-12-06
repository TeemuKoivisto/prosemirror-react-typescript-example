import React from 'react'
import applyDevTools from 'prosemirror-dev-tools'

import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';

import { PortalProviderAPI } from './react-portals'
import { EventDispatcher, createDispatch, Dispatch } from './utils/event-dispatcher'
import { startMeasure, stopMeasure } from './performance/measure'
import {
  findChangedNodesFromTransaction,
  validateNodes,
  validNode,
} from './utils/nodes'
import { getDocStructure, SimplifiedNode } from './utils/document-logger';

import { createPMPlugins, processPluginsList } from './create-editor/create-plugins'
import { createPluginsList } from './create-editor/create-plugins-list'
import { createSchema } from './create-editor/create-schema'
import { getUAPrefix } from './utils/browser'

import { EditorProps } from './Editor'
import { EditorConfig, EditorPlugin } from './types'

export interface EditorViewProps {
  editorProps: EditorProps;
  portalProviderAPI: PortalProviderAPI;
  render?: (props: {
    editor: JSX.Element;
    view?: EditorView;
    config: EditorConfig;
    eventDispatcher: EventDispatcher;
  }) => JSX.Element
}
// interface IState {
//   editorState: EditorState
//   editorView?: EditorView
//   eventDispatcher: EventDispatcher
// }

/**
 * The editor React component which is a class instead of a function component
 * since the exhaustive-deps linting rule drives me nuts as it requires adding everything
 * to the useEffect dependencies. Even adding values that should never change and if they did,
 * there should be an error instead of rerunning the useEffect hook.
 */
export class ReactEditorView extends React.Component<EditorViewProps, {}> {

  config!: EditorConfig;
  editorState: EditorState
  editorView?: EditorView
  eventDispatcher: EventDispatcher
  dispatch: Dispatch

  // ProseMirror is instantiated prior to the initial React render cycle,
  // so we allow transactions by default, to avoid discarding the initial one.
  private canDispatchTransactions = true;

  private focusTimeoutId: number | undefined;

  constructor(props: EditorViewProps) {
    super(props)
    this.eventDispatcher = new EventDispatcher()
    this.dispatch = createDispatch(this.eventDispatcher)
    this.editorState = this.createEditorState({
      props,
      replaceDoc: true,
    })
  }

  // componentDidMount() {
  //   this.createEditorView(this.editorRef.current)
  //   this.forceUpdate()
  // }

  // shouldComponentUpdate() {
  //   return false
  // }

  componentDidMount() {
    // Transaction dispatching is already enabled by default prior to
    // mounting, but we reset it here, just in case the editor view
    // instance is ever recycled (mounted again after unmounting) with
    // the same key.
    // Although storing mounted state is an anti-pattern in React,
    // we do so here so that we can intercept and abort asynchronous
    // ProseMirror transactions when a dismount is imminent.
    this.canDispatchTransactions = true;
  }

  /**
   * Clean up any non-PM resources when the editor is unmounted
   */
  componentWillUnmount() {
    // We can ignore any transactions from this point onwards.
    // This serves to avoid potential runtime exceptions which could arise
    // from an async dispatched transaction after it's unmounted.
    // this.canDispatchTransactions = false;

    this.eventDispatcher.destroy();

    clearTimeout(this.focusTimeoutId);

    if (this.editorView) {
      // Destroy the state if the Editor is being unmounted
      const editorState = this.editorView.state;
      editorState.plugins.forEach(plugin => {
        const state = plugin.getState(editorState);
        if (state && state.destroy) {
          state.destroy();
        }
      });
    }
    // this.editorView will be destroyed when React unmounts in handleEditorViewRef
  }

  // Helper to allow tests to inject plugins directly
  getPlugins(
    editorProps: EditorProps,
    prevEditorProps?: EditorProps,
  ): EditorPlugin[] {
    return createPluginsList(editorProps, prevEditorProps);
  }

  createEditorState = (options: {
    props: EditorViewProps;
    replaceDoc?: boolean;
  }) => {
    if (this.editorView) {
      /**
       * There's presently a number of issues with changing the schema of a
       * editor inflight. A significant issue is that we lose the ability
       * to keep track of a user's history as the internal plugin state
       * keeps a list of Steps to undo/redo (which are tied to the schema).
       * Without a good way to do work around this, we prevent this for now.
       */
      // eslint-disable-next-line no-console
      console.warn(
        'The editor does not support changing the schema dynamically.',
      );
      return this.editorState;
    }

    this.config = processPluginsList(
      this.getPlugins(
        options.props.editorProps,
        undefined,
      ),
    );
    const schema = createSchema(this.config);

    const plugins = createPMPlugins({
      schema,
      dispatch: this.dispatch,
      editorConfig: this.config,
      eventDispatcher: this.eventDispatcher,
      portalProviderAPI: this.props.portalProviderAPI,
    });

    let doc;

    let selection: Selection | undefined;
    if (doc) {
      // ED-4759: Don't set selection at end for full-page editor - should be at start
      selection = options.props.editorProps.appearance === 'full-page'
        ? Selection.atStart(doc)
        : Selection.atEnd(doc);
    }
    // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error
    const patchedSelection = selection
      ? Selection.findFrom(selection.$head, -1, true) || undefined
      : undefined;

    return EditorState.create({
      schema,
      plugins,
      doc,
      selection: patchedSelection,
    });
  };

  reconfigureState = (props: EditorViewProps) => {
    if (!this.editorView) {
      return;
    }

    // We cannot currently guarantee when all the portals will have re-rendered during a reconfigure
    // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
    // nodes that haven't been re-rendered to the document yet.
    if (this.editorView.dom instanceof HTMLElement && this.editorView.hasFocus()) {
      this.editorView.dom.blur();
    }

    this.config = processPluginsList(
      this.getPlugins(
        props.editorProps,
        this.props.editorProps,
      ),
    );

    const state = this.editorState;
    const plugins = createPMPlugins({
      schema: state.schema,
      dispatch: this.dispatch,
      editorConfig: this.config,
      eventDispatcher: this.eventDispatcher,
      portalProviderAPI: props.portalProviderAPI,
    });

    const newState = state.reconfigure({ plugins });

    // need to update the state first so when the view builds the nodeviews it is
    // using the latest plugins
    this.editorView.updateState(newState);

    return this.editorView.update({ ...this.editorView.props, state: newState });
  }

  private dispatchTransaction = (transaction: Transaction) => {
    if (!this.editorView) {
      return;
    }

    const shouldTrack = true
    shouldTrack && startMeasure(`🦉 ReactEditorView::dispatchTransaction`);

    const nodes: PMNode[] = findChangedNodesFromTransaction(transaction);
    const changedNodesValid = validateNodes(nodes);

    if (changedNodesValid) {
      const oldEditorState = this.editorView.state;

      // go ahead and update the state now we know the transaction is good
      shouldTrack && startMeasure(`🦉 EditorView::state::apply`);
      const editorState = this.editorView.state.apply(transaction);
      shouldTrack && stopMeasure(`🦉 EditorView::state::apply`);

      if (editorState === oldEditorState) {
        return;
      }

      shouldTrack && startMeasure(`🦉 EditorView::updateState`);
      this.editorView.updateState(editorState);
      shouldTrack && stopMeasure(`🦉 EditorView::updateState`);

      this.editorState = editorState;
    } else {
      const invalidNodes = nodes
        .filter(node => !validNode(node))
        .map<SimplifiedNode | string>(node => getDocStructure(node));

      if (shouldTrack) {
        console.error('Invalid nodes in transaction')
        console.log(transaction)
        console.log(invalidNodes)
      }      
    }

    shouldTrack &&
      stopMeasure(`🦉 ReactEditorView::dispatchTransaction`, () => {});
  }

  getDirectEditorProps = (state?: EditorState): DirectEditorProps => {
    return {
      state: state || this.editorState,
      dispatchTransaction: (tr: Transaction) => {
        // Block stale transactions:
        // Prevent runtime exceptions from async transactions that would attempt to
        // update the DOM after React has unmounted the Editor.
        if (this.canDispatchTransactions) {
          this.dispatchTransaction(tr);
        }
      },
      // Disables the contentEditable attribute of the editor if the editor is disabled
      editable: _state => true, // !this.props.editorProps.disabled,
      attributes: { 'data-gramm': 'false' },
    }
  }

  createEditorView(element: HTMLDivElement) {
    // Creates the editor-view from this.editorState. If an editor has been mounted
    // previously, this will contain the previous state of the editor.
    this.editorView = new EditorView({ mount: element }, this.getDirectEditorProps())
    applyDevTools(this.editorView!)
  }

  handleEditorViewRef = (node: HTMLDivElement) => {
    if (!this.editorView && node) {
      this.createEditorView(node);
      const view = this.editorView!;

      if (
        this.props.editorProps.shouldFocus
      ) {
        this.focusTimeoutId = handleEditorFocus(view);
      }

      // Force React to re-render so consumers get a reference to the editor view
      this.forceUpdate();
    } else if (this.editorView && !node) {
      // When the appearance is changed, React will call handleEditorViewRef with node === null
      // to destroy the old EditorView, before calling this method again with node === div to
      // create the new EditorView
      // this.props.onEditorDestroyed({
      //   view: this.editorView,
      //   config: this.config,
      //   eventDispatcher: this.eventDispatcher,
      // });
      this.editorView.destroy(); // Destroys the dom node & all node views
      this.editorView = undefined;
    }
  }

  private editor = (
    <div
      className={getUAPrefix()}
      key="ProseMirror"
      ref={this.handleEditorViewRef}
    />
  )

  render() {
    return this.props.render
      ? this.props.render({
          editor: this.editor,
          view: this.editorView,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
        })
      : this.editor
  }
}

function handleEditorFocus(view: EditorView): number | undefined {
  if (view.hasFocus()) {
    return;
  }
  return window.setTimeout(() => {
    view.focus();
  }, 0);
}
