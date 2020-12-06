import React, { useMemo, useState } from 'react'

import { ReactEditorView } from './ReactEditorView'
import { EditorActions } from './EditorActions'
import { EditorContext } from './EditorContext'
import { PortalProvider, PortalRenderer } from './react-portals'

import { FullPage } from './editor-appearance/FullPage'

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
  } = props
  const [editorActions] = useState<EditorActions>(new EditorActions())
  const Component = useMemo(() => components[appearance], [appearance])

  return (
    <EditorContext editorActions={editorActions}>
      <PortalProvider render={portalProviderAPI => (
        <>
          <ReactEditorView
            editorProps={props}
            portalProviderAPI={portalProviderAPI}
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
                eventDispatcher={eventDispatcher}
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
