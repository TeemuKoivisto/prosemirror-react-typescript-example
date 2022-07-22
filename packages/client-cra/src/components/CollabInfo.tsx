import * as React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
}

export function CollabInfo(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <summary>Collaboration</summary>
      <p>
        The full editor implements a simplistic collaboration. Clicking the 'sync' icon should start a bidirectional
        connection to the collab-server to sync docs with the database. By default only one user can edit document
        at a time and the document should appear locked to other users.
      </p>
      <p>
        Once 'collab' icon is clicked, a collaboration
        editing session is initiated. Disabling it <em>should</em> lock it for the other users. However, the implementation
        is still pending..
      </p>
      <p>
        NOTE: the example collab-server works only locally. I might deploy it to Heroku at some point.
      </p>
    </Container>
  )
}

const Container = styled.details`
  & > summary {
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: 600;
  }
`
