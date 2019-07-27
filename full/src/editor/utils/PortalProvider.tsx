import * as React from 'react'
import ReactDOM from 'react-dom'

type MountedPortal = {
  component: React.ReactElement
}

// Modified from https://bitbucket.org/atlassian/atlaskit-mk-2/src/0fcae893b790443a30f7dadae00638d6e4238b2f/packages/editor/editor-core/src/ui/PortalProvider/index.tsx?at=master
export class PortalProvider {

  portals: Map<HTMLElement, MountedPortal> = new Map()

  render(
    component: React.ReactElement,
    container: HTMLElement,
  ) {
    this.portals.set(container, { component })
    ReactDOM.render(component, container)
    // TODO something still wrong with this
    // ReactDOM.createPortal(
    //   component,
    //   container,
    // )
  }

  remove(container: HTMLElement) {
    this.portals.delete(container)
    ReactDOM.unmountComponentAtNode(container)
  }
}
