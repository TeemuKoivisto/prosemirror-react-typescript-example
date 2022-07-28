import styled, { css } from 'styled-components'
import { fontSize, fontSizeSmall } from '../../../theme/constants'
import {
  getThemeStyle,
  themeNamespace,
  compactSmallFontSize,
  compactLineHeight,
} from '../util/theme'

// Checkbox/Radio wrapper -- sits left of the children
export const InputWrapper = styled.span`
  display: flex;
  margin: 0 2px;
`

// Elements injected before/after the children
const BeforeAfterBase = styled.span`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  /* Fix windows line-height issue */
  padding-bottom: 1px;
`

const getBeforeSpacing = ({ isCompact, theme }: { isCompact?: boolean; theme: any }) => {
  const spaceKey = isCompact ? 'compact' : 'default'
  const space = getThemeStyle(theme[themeNamespace], spaceKey, 'beforeItemSpacing')
  return css`
    margin-right: ${space}px;
  `
}
export const Before = styled(BeforeAfterBase)<{ isCompact?: boolean }>`
  ${getBeforeSpacing};
`

const getAfterSpacing = ({ isCompact, theme }: { isCompact?: boolean; theme: any }) => {
  const spaceKey = isCompact ? 'compact' : 'default'
  const space = getThemeStyle(theme[themeNamespace], spaceKey, 'afterItemSpacing')
  return css`
    margin-left: ${space}px;
  `
}
export const After = styled(BeforeAfterBase)<{ isCompact?: boolean }>`
  ${getAfterSpacing};
`

// Alignment and layout for the children
export const ContentWrapper = styled.span`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0;
  overflow: hidden;

  &:first-child {
    margin: 0;
  }
`

export const Content = styled.span<{ allowMultiline?: boolean }>`
  display: block;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${({ allowMultiline }) => (allowMultiline ? 'normal' : 'nowrap')};
  line-height: ${16 / fontSize()};
  /* Fix windows line-height issue */
  padding-bottom: 1px;
`

const getColorStyle = ({ isDisabled, theme }: { isDisabled?: boolean; theme: any }) => {
  if (isDisabled) {
    return css`
      color: ${getThemeStyle(theme[themeNamespace], 'secondaryText', 'disabled')};
    `
  }

  return css`
    color: ${getThemeStyle(theme[themeNamespace], 'secondaryText', 'default')};

    /* This detects hover on the grandparent. Saves us having to maintain isHovered
       state in the grandparent. */
    *:hover > * > & {
      color: ${() => getThemeStyle(theme[themeNamespace], 'secondaryText', 'hover')};
    }

    *:active > * > & {
      color: ${() => getThemeStyle(theme[themeNamespace], 'secondaryText', 'active')};
    }
  `
}

const getDescriptionFontStyles = ({ isCompact }: { isCompact?: boolean }) => {
  const descriptionFontSize = isCompact ? compactSmallFontSize : fontSizeSmall()
  const lineHeight = isCompact ? compactLineHeight : 14 / descriptionFontSize
  return css`
    font-size: ${descriptionFontSize}px;
    line-height: ${lineHeight};
    /* Fix windows line-height issue */
    padding-bottom: 1px;
  `
}

// Description is a block element below the children, like a subtitle
export const Description = styled.span<{ isCompact?: boolean; isDisabled?: boolean }>`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${getColorStyle};
  ${getDescriptionFontStyles};
`
