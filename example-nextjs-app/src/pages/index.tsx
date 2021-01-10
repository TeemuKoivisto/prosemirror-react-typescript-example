import * as React from 'react'
import styled from 'styled-components'

import { Editor } from 'full'

import { Layout } from '../components/Layout'
import { PageHeader } from '../components/PageHeader'

interface IProps {
}

export default function FrontPage(props: IProps) {
  return (
    <Layout>
      <PageHeader>
        <Editor />
      </PageHeader>
    </Layout>
  )
}
