import { Underline, IUnderlineAttrs } from './Underline'

import { ReactNodeView } from './ReactNodeView'
import { PortalProvider } from '../utils/PortalProvider'

export const nodeViews = (portalProvider: PortalProvider) => ({
  underline: ReactNodeView.fromComponent<IUnderlineAttrs>(Underline, portalProvider),
})
