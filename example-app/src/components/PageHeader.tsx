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
          <li><b>Ctrl + alt + b</b>: New blockquote</li>
          <li><b>Ctrl + alt + p</b>: New ProseMirror-managed blockquote</li>
          <li><b>Ctrl + alt + u</b>: New underline paragraph</li>
          <li><b>Ctrl + alt + s</b>: Split current block</li>
          <li><b>/</b>: Quick insert (Atlassian editor only)</li>
        </ul>
        { children }
      </div>
    </Container>
  )
}

const Container = styled.div`
`
