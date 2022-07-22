import * as React from 'react'
import styled from 'styled-components'

import { Editor } from '@example/minimal'

import { Layout } from '../components/Layout'
import { PageHeader } from '../components/PageHeader'

interface IProps {
}

export default function MinimalPage(props: IProps) {
  return (
    <Layout>
      <PageHeader>
        <Editor />
      </PageHeader>
    </Layout>
  )
}
