import React, { useEffect, useState } from 'react'
import { toggleMark } from 'prosemirror-commands'
import styled from 'styled-components'

import { MdFormatBold, MdFormatItalic } from 'react-icons/md'

import { BaseExtension, BaseState, useEditorContext } from '@example/full-v2'

import { MarkButton } from './MarkButton'

interface IProps {
  className?: string
}

export function Toolbar(props: IProps) {
  // Iterate over primaryToolbarComponents here
  const { viewProvider, pluginsProvider } = useEditorContext()
  const [currentMarks, setCurrentMarks] = useState<string[]>([])

  useEffect(() => {
    pluginsProvider.subscribe(BaseExtension.pluginKey, onBasePluginChange)
    return () => {
      pluginsProvider.unsubscribe(BaseExtension.pluginKey, onBasePluginChange)
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
          icon={<MdFormatBold size={24} />}
          onClick={toggleBold}
        />
        <MarkButton
          active={currentMarks.includes('em')}
          name="italics"
          icon={<MdFormatItalic size={24} />}
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
