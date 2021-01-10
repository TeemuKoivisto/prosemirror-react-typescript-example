import * as React from 'react'
import styled from 'styled-components'

import { Editor } from 'atlassian'

import { Layout } from '../components/Layout'
import { PageHeader } from '../components/PageHeader'

interface IProps {
}

export default function AtlassianPage(props: IProps) {
  return (
    <Layout>
      <PageHeader>
        <Editor performanceTracking/>
      </PageHeader>
    </Layout>
  )
}
