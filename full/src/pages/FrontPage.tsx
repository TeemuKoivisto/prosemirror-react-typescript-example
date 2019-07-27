import * as React from 'react'
import styled from 'styled-components'

import { Editor } from '../editor/Editor'

export class FrontPage extends React.PureComponent {
  render() {
    return (
      <Container>
        <header>
          <h1><a href="https://teemukoivisto.github.io/prosemirror-react-typescript-example/">
            ProseMirror React Typescript Example</a></h1>
          <p>Demo application to show how to combine ProseMirror with React</p>
          <p><a href="https://teemukoivisto.github.io/prosemirror-react-typescript-example/">Github repo</a></p>
        </header>
        <div>
          <ul>
            <li><b>Ctrl + n</b>: New underline paragraph</li>
            <li><b>Ctrl + p</b>: New normal paragraph (not working)</li>
            <li><b>Ctrl + s</b>: Split current block</li>
          </ul>
          <Editor />
        </div>
      </Container>
    )
  }
}

const Container = styled.div`
`
