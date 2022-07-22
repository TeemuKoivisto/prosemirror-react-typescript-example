import React from 'react'
import styled from 'styled-components'

import { PageHeader } from '../components/PageHeader'
import { CollabInfo } from '../components/CollabInfo'
import { DocumentBrowser } from '../components/DocumentBrowser'
import { Editor } from '../components/editor/Editor'

interface IProps {
  className?: string
}

export function FrontPage(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <PageHeader />
      <CollabInfo />
      <DocumentBrowser />
      <Editor/>
    </Container>
  )
}

const Container = styled.div`
  & > ${DocumentBrowser} {
    margin: 1rem 0;
  }
`
