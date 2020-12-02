import * as React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
  children: React.ReactNode
}

export function PageHeader(props: IProps) {
  const { className, children } = props
  return (
    <Container className={className}>
      <header>
        <h1><a href="https://teemukoivisto.github.io/prosemirror-react-typescript-example/">
          ProseMirror React Typescript Example</a></h1>
        <p>Demo application to show how to combine ProseMirror with React</p>
        <p><a href="https://github.com/TeemuKoivisto/prosemirror-react-typescript-example">Github repo</a></p>
      </header>
      <div>
        <ul>
          <li><b>Ctrl + n</b>: New underline paragraph</li>
          <li><b>Ctrl + p</b>: New normal paragraph (not working)</li>
          <li><b>Ctrl + s</b>: Split current block</li>
        </ul>
        { children }
      </div>
    </Container>
  )
}

const Container = styled.div`
`
