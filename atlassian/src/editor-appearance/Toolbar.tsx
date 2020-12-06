import React from 'react'
import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands'
import { EditorView } from 'prosemirror-view'
import styled from 'styled-components'

// import {
//   MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdArrowDownward, MdBorderHorizontal,
//   MdFormatListNumbered, MdTextFormat, MdSpaceBar
// } from 'react-icons/md'

import { EditorActions } from '../EditorActions'
import { EventDispatcher } from '../utils/event-dispatcher'

import { EditorAppearance, ToolbarUIComponentFactory } from '../types'

interface IProps {
  className?: string
  appearance?: EditorAppearance;
  editorActions?: EditorActions;
  // editorDOMElement: JSX.Element;
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
  primaryToolbarComponents?: ToolbarUIComponentFactory[];
}

export function Toolbar(props: IProps) {
  // Iterate over primaryToolbarComponents here
  return (
    <Container>
      <MarksRow>
      </MarksRow>
    </Container>
  )
}

const Container = styled.div`
  background: snow;
  border: 1px solid black;
  border-bottom: 0;
  padding: 10px;
  & > h2 {
    margin: 0 0 5px 0;
  }
`
const MarksRow = styled.div`
  display: flex;
`
const MiddleRow = styled.div`
  display: flex;
`
