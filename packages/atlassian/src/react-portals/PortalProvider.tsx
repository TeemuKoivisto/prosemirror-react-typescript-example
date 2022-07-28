import React from 'react'
import { PortalProviderAPI } from './PortalProviderAPI'

export type PortalProviderProps = {
  render: (portalProviderAPI: PortalProviderAPI) => React.ReactNode | JSX.Element | null
  children?: React.ReactNode
}

export class PortalProvider extends React.Component<PortalProviderProps> {
  static displayName = 'PortalProvider'

  portalProviderAPI: PortalProviderAPI

  constructor(props: PortalProviderProps) {
    super(props)
    this.portalProviderAPI = new PortalProviderAPI()
  }

  render() {
    return this.props.render(this.portalProviderAPI)
  }

  componentDidUpdate() {
    this.portalProviderAPI.forceUpdate()
  }
}
