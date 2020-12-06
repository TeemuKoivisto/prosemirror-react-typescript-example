import React, { useEffect, useMemo, useState } from 'react'

import { ReactEditorView } from './ReactEditorView'
import { EditorActions } from './EditorActions'
import { EditorContext } from './EditorContext'
import { PortalProvider } from './react-portals/PortalProvider'
import { PortalRenderer } from './react-portals/PortalRenderer'

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

// An interesting feature of which I'm not completely sure what is its purpose
// https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-common/src/extensions/
// extensionProvider: any

export function Editor(props: EditorProps) {
  const {
    appearance = 'full-page',
  } = props
  const [editorActions] = useState<EditorActions>(new EditorActions())
  // const Component = useMemo(() => {
  //   if (appearance === 'full-page') {
  //     return FullPage
  //   }
  //   return null
  // }, [appearance])
  // useEffect(() => {

  // }, [])

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
              <FullPage
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

// export class Editor extends React.Component<EditorProps> {
//   static defaultProps: EditorProps = {
//     appearance: 'full-page',
//   }

//   // An interesting feature of which I'm not completely sure what is its purpose
//   // https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-common/src/extensions/
//   // extensionProvider: any

//   private editorActions: EditorActions

//   constructor(props: EditorProps, context: { editorActions?: EditorActions }) {
//     super(props)
//     this.editorActions = (context || {}).editorActions || new EditorActions();
//   }

//   render() {
//     const Component = getUiComponent(this.props.appearance!)
//     return (
//       <EditorContext editorActions={this.editorActions}>
//         <PortalProvider render={portalProviderAPI => (
//           <>
//             <ReactEditorView
//               render={({
//                 editor,
//                 view,
//                 eventDispatcher,
//                 config,
//               }) => (
//                 <Component
//                 appearance={this.props.appearance!}
//                 editorActions={this.editorActions}
//                 // editorDOMElement={editor}
//                 editorView={view}
//                 eventDispatcher={eventDispatcher}
//                 primaryToolbarComponents={
//                   config.primaryToolbarComponents
//                 }
//               />)}
//             />
//             <PortalRenderer
//               portalProviderAPI={portalProviderAPI}
//             />
//           </>
//         )}>
//         </PortalProvider>
//       </EditorContext>
//     )
//   }
// }

// function Editor(props: EditorProps) {
//   const plugins = usePresetContext();

//   return (
//     <IntlProvider locale="en">
//       <PortalProvider
//         onAnalyticsEvent={props.onAnalyticsEvent}
//         render={portalProviderAPI => (
//           <>
//             <EditorInternal
//               {...props}
//               plugins={plugins.length ? plugins : props.plugins}
//               portalProviderAPI={portalProviderAPI}
//               onAnalyticsEvent={props.onAnalyticsEvent}
//             />
//             <PortalRenderer portalProviderAPI={portalProviderAPI} />
//           </>
//         )}
//       />
//     </IntlProvider>
//   );
// }
