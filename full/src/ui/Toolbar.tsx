import React, { useEffect, useState } from 'react'
import { toggleMark } from 'prosemirror-commands'
import styled from 'styled-components'

import {
  MdFormatBold, MdFormatItalic
} from 'react-icons/md'

import {
  basePluginKey,
  BaseState,
} from '../editor-plugins/base'

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
  const { viewProvider, pluginsProvider } = useEditorContext()
  const [currentMarks, setCurrentMarks] = useState<string[]>([])

  useEffect(() => {
    pluginsProvider.subscribe(basePluginKey, onBasePluginChange)
    return () => {
      pluginsProvider.unsubscribe(basePluginKey, onBasePluginChange)
    }
  }, [])

  function onBasePluginChange(newPluginState: BaseState) {
    setCurrentMarks(newPluginState.activeMarks)
  }
  function toggleBold() {
    viewProvider.execCommand(toggleMark(viewProvider.editorView.state.schema.marks.strong))
  }
  function toggleItalics() {
    viewProvider.execCommand(toggleMark(viewProvider.editorView.state.schema.marks.em))
  }
  return (
    <Container>
      <TopRow>
        <MarkButton
          active={currentMarks.includes('strong')}
          name="bold"
          icon={<MdFormatBold size={24}/>}
          onClick={toggleBold}
        />
        <MarkButton
          active={currentMarks.includes('em')}
          name="italics"
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
