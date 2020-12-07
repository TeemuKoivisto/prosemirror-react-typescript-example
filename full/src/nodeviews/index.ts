import { Underline, IUnderlineAttrs } from './Underline'
import { BlockQuote } from './BlockQuote'
import { blockQuoteNodeView } from './BlockQuoteView'

import { OldReactNodeView } from './OldReactNodeView'
import { PortalProvider } from '../react-portals'

export const nodeViews = (portalProvider: PortalProvider) => ({
  underline: OldReactNodeView.fromComponent(Underline, portalProvider),
  blockquote: blockQuoteNodeView(portalProvider)
})
