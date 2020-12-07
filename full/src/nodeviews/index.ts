import { Underline, IUnderlineAttrs } from './Underline'
import { BlockQuote } from './BlockQuote'
import { blockQuoteNodeView } from './BlockQuoteView'
import { underlineNodeView } from './UnderlineView'

import { OldReactNodeView } from './OldReactNodeView'
import { PortalProvider } from '../react-portals'

export const nodeViews = (portalProvider: PortalProvider) => ({
  // underline: OldReactNodeView.fromComponent(Underline, portalProvider),
  underline: underlineNodeView(portalProvider),
  blockquote: blockQuoteNodeView(portalProvider),
})
