import React from 'react'
import styled from 'styled-components'

import { Toolbar } from './Toolbar'

interface IProps {
  className?: string
  children: React.ReactNode
}

export function DesktopLayout(props: IProps) {
  const { className, children } = props
  return (
    <Container className={className}>
      <Toolbar/>
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

  .pm-blockquote {
    box-sizing: border-box;
    color: #2d82e1;
    padding: 0 1em;
    border-left: 4px solid #48a1fa;
    margin: 0.2rem 0 0 0;
    margin-right: 0;
  }
`
