import * as React from 'react'
import styled from 'styled-components'

import { Editor } from 'minimal'

import { PageHeader } from '../components/PageHeader'

interface IProps {
  className?: string
}

export function MinimalPage(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <PageHeader>
        <Editor />
      </PageHeader>
    </Container>
  )
}

const Container = styled.div`
`
