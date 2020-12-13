import React from 'react'
import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands'
import { EditorView } from 'prosemirror-view'
import { MarkType } from 'prosemirror-model'
import styled from 'styled-components'

import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdArrowDownward, MdBorderHorizontal,
  MdFormatListNumbered, MdTextFormat, MdSpaceBar
} from 'react-icons/md'

import { useEditorContext } from '../core/EditorContext'

import { MarkButton } from './MarkButton'

// import { EditorAppearance, ToolbarUIComponentFactory } from '../types'

interface IProps {
  className?: string
}

// function markActive(state, type) {
//   let {from, $from, to, empty} = state.selection
//   if (empty) return type.isInSet(state.storedMarks || $from.marks())
//   else return state.doc.rangeHasMark(from, to, type)
// }

export function Toolbar(props: IProps) {
  // Iterate over primaryToolbarComponents here
  const { editorActions } = useEditorContext()

  function handleToggleMark(markSchema: MarkType) {
    const view = editorActions.editorView
    toggleMark(markSchema)(view.state, view.dispatch)
    editorActions.focus()
  }
  function toggleBold() {
    handleToggleMark(editorActions.editorView.state.schema.marks.strong)
  }
  function toggleItalics() {
    handleToggleMark(editorActions.editorView.state.schema.marks.em)
  }
  console.log('render')
  return (
    <Container>
      <TopRow>
        <MarkButton
          active={false}
          name="bold"
          icon={<MdFormatBold size={24}/>}
          onClick={toggleBold}
        />
        <MarkButton
          active={false}
          name="italic"
          icon={<MdFormatItalic size={24}/>}
          onClick={toggleItalics}
        />
      </TopRow>
    </Container>
  )
}

const Container = styled.div`
  background: snow;
  border: 1px solid black;
  border-bottom: 0;
  padding: 10px;
`
const TopRow = styled.div`
  display: flex;
`
