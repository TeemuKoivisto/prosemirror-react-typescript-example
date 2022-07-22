import React from 'react';
import { createPortal } from 'react-dom';
import { PortalProviderAPI } from './PortalProviderAPI'

export type Portals = Map<HTMLElement, React.ReactChild>;

interface IProps {
  portalProviderAPI: PortalProviderAPI
}
interface IState {
  portals: Portals
}

export class PortalRenderer extends React.Component<IProps, IState> {

  constructor(props: IProps) {
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
