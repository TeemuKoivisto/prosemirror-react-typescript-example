import * as React from 'react'
import styled from 'styled-components'

import { Editor } from '@example/minimal'

import { PageHeader } from '../components/PageHeader'

interface IProps {
  className?: string
}

export function MinimalPage(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <PageHeader />
      <Editor />
    </Container>
  )
}

const Container = styled.div``
