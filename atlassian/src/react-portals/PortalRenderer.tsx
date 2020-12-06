import React from 'react';
import { createPortal } from 'react-dom';
import { PortalProviderAPI } from './PortalProviderAPI'

import { Portals, PortalRendererState } from './PortalProvider'

export class PortalRenderer extends React.Component<
{ portalProviderAPI: PortalProviderAPI },
PortalRendererState
> {
constructor(props: { portalProviderAPI: PortalProviderAPI }) {
  super(props);
  props.portalProviderAPI.setContext(this);
  props.portalProviderAPI.on('update', this.handleUpdate);
  this.state = { portals: new Map() };
}

handleUpdate = (portals: Portals) => this.setState({ portals });

render() {
  const { portals } = this.state;
  return (
    <>
      {Array.from(portals.entries()).map(([container, children]) =>
        createPortal(children, container),
      )}
    </>
  );
}
}