import React from 'react'
import styled from 'styled-components'
// import { EditorView } from 'prosemirror-view'

interface IProps {
  className?: string
  children: React.ReactChildren
}

export function FullPage(props: IProps) {
  const { className, children } = props
  return (
    <Container className={className}>
      <ContentArea>
        {children}
      </ContentArea>
    </Container>
  )
}

const Container = styled.div``
const ContentArea = styled.div`
  border: 1px solid black;
  & > .ProseMirror {
    min-height: 140px;
    overflow-wrap: break-word;
    outline: none;
    padding: 10px;
    white-space: pre-wrap;
  }
`
