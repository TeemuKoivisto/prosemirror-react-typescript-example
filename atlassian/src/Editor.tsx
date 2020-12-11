import React, { useEffect, useMemo, useState } from 'react'
import { EditorView } from 'prosemirror-view'

import { ReactEditorView } from './ReactEditorView'
import { EditorActions } from './EditorActions'
import { EditorContext } from './EditorContext'
import { PortalProvider, PortalRenderer } from './react-portals'
import { ProviderFactory } from './provider-factory/ProviderFactory'
import { EventDispatcher } from './utils/event-dispatcher'

import { FullPage } from './editor-appearance/FullPage/FullPage'
import { quickInsertProviderFactory } from './provider-factory/quick-insert-provider'

import { QuickInsertOptions } from './plugins/quick-insert/types';

import { EditorAppearance } from './types/editor-ui'

export interface EditorProps {
  /*
  Configure the display mode of the editor. Different modes may have different feature sets supported.

  - `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
  - `full-page` - should be used for a full page editor where it is the user focus of the page
  - `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
  - `mobile` - should be used for the mobile web view. It is a full page editor version for mobile.
  */
  appearance?: EditorAppearance

  // Set to enable the quick insert menu i.e. '/' key trigger.
  // You can also provide your own insert menu options that will be shown in addition to the enabled
  // editor features e.g. Confluence uses this to provide its macros.
  quickInsert?: QuickInsertOptions;

  // Set if the editor should be focused.
  shouldFocus?: boolean;

  /**
   * @description Control performance metric measurements and tracking
   */
  performanceTracking?: boolean;
}

// An interesting feature whose purpose I'm not completely sure what is
// https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-common/src/extensions/
// extensionProvider: any

const components = {
  'full-page': FullPage,
}

export function Editor(props: EditorProps) {
  const {
    appearance = 'full-page',
    quickInsert
  } = props
  const [editorActions] = useState<EditorActions>(new EditorActions())
  const [providerFactory] = useState(new ProviderFactory())
  const [quickInsertProvider] = useState(Promise.resolve(quickInsertProviderFactory()))
  const Component = useMemo(() => components[appearance], [appearance])

  useEffect(() => {
    handleProviders()
  }, [])

  function handleProviders() {
    if (quickInsertProvider) {
      providerFactory.setProvider(
        'quickInsertProvider',
        quickInsertProvider,
      );
    }
  }

  function onEditorCreated(instance: {
    view: EditorView,
    eventDispatcher: EventDispatcher
    // transformer?: Transformer<string>;
  }) {
    editorActions._privateRegisterEditor(instance.view, instance.eventDispatcher)
  }

  function onEditorDestroyed(_instance: {
    view: EditorView,
    transformer?: Transformer<string>
  }) {
    editorActions._privateUnregisterEditor()
  }

  return (
    <EditorContext editorActions={editorActions}>
      <PortalProvider render={portalProviderAPI => (
        <>
          <ReactEditorView
            editorProps={props}
            providerFactory={providerFactory}
            portalProviderAPI={portalProviderAPI}
            onEditorCreated={onEditorCreated}
            onEditorDestroyed={onEditorDestroyed}
            render={({
              editor,
              view,
              eventDispatcher,
              config,
            }) => (
              <Component
                appearance={appearance}
                editorActions={editorActions}
                editorDOMElement={editor}
                editorView={view}
                providerFactory={providerFactory}
                eventDispatcher={eventDispatcher}
                contentComponents={config.contentComponents}
                primaryToolbarComponents={
                  config.primaryToolbarComponents
                }
              />)}
          />
          <PortalRenderer
            portalProviderAPI={portalProviderAPI}
          />
        </>
      )}>
      </PortalProvider>
    </EditorContext>
  )
}
