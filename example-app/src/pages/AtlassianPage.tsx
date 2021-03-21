import * as React from 'react'
import styled from 'styled-components'

import { Editor } from '@pm-react-example/atlassian'

import { PageHeader } from '../components/PageHeader'

interface IProps {
  className?: string
}

export function AtlassianPage(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <PageHeader />
      <Editor performanceTracking/>
    </Container>
  )
}

const Container = styled.div`
`
