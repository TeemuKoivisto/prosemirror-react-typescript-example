import styled, { css } from 'styled-components'
import { gridSize, borderRadius } from '../theme/constants'
import { N30, N100 } from '../theme/colors'
// import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
const akEditorMobileMaxWidth = 0

const akGridSize = gridSize() + 'px'

// Taken from the style of inline dialog components
export const dropShadow = css`
  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25);
`

export const scrollbarStyles = `
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar {
    height: ${akGridSize};
    width: ${akGridSize};
  }

  &::-webkit-scrollbar-corner {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: ${akGridSize};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`

export const Shortcut = styled.div`
  background-color: rgba(223, 225, 229, 0.5); /* N60 at 50% */
  color: ${N100};
  border-radius: ${borderRadius()}px;
  padding: 4px;
  line-height: 12px;
  font-size: 11.67px;
  align-self: flex-end;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    display: none;
  }
`

type CellColourPreviewProps = {
  selectedColor: string
}

export const CellColourPreview = styled.div<CellColourPreviewProps>`
  &::before {
    background: ${(props) => props.selectedColor};
  }
`
