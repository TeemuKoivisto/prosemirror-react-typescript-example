import React from 'react'
import styled from 'styled-components'
import { EditorView } from 'prosemirror-view'

import { EditorActions } from '../EditorActions'
import { EventDispatcher } from '../utils/event-dispatcher'

import { Toolbar } from './Toolbar'

import { EditorAppearance, ToolbarUIComponentFactory } from '../types'

interface IProps {
  className?: string
  appearance?: EditorAppearance;
  editorActions?: EditorActions;
  editorDOMElement: JSX.Element;
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
  primaryToolbarComponents?: ToolbarUIComponentFactory[];
}

export function FullPage(props: IProps) {
  const { className, editorDOMElement } = props
  return (
    <Container className={className}>
      <Toolbar />
      <ContentArea>
        {editorDOMElement}
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
