import styled, { css } from 'styled-components';
import { N60A } from '../../theme/colors';
import { getThemeStyle, themeNamespace } from '../util/theme';

const getItemState = stateName => ({ theme }) => {
  const stateStyles = getThemeStyle(theme[themeNamespace], stateName);
  return css`
    background-color: ${stateStyles.background};
    color: ${stateStyles.text};
    fill: ${stateStyles.background};
    text-decoration: none;

    &:focus {
      color: ${stateStyles.text};
    }
  `;
};

const getPadding = ({ isCompact, theme, description }) => {
  const paddingKey = isCompact ? 'compact' : 'default';
  const { bottom = 0, left = 0, right = 0, top = 0 } = getThemeStyle(
    theme[themeNamespace],
    paddingKey,
    'padding',
  );

  let adjustedTop = typeof top === 'function' ? top() : top;
  let adjustedBottom = typeof bottom === 'function' ? bottom() : bottom;

  // Subtract the 1px padding-bottom added to the content and description elements
  // to maintain original height
  adjustedTop = Math.max(description ? adjustedTop - 1 : adjustedTop, 0);
  adjustedBottom = Math.max(adjustedBottom - 1, 0);

  return css`
    padding: ${adjustedTop}px ${right}px ${adjustedBottom}px ${left}px;
  `;
};

const getHeightStyles = ({ isCompact, theme }) => {
  const heightKey = isCompact ? 'compact' : 'default';
  const height = getThemeStyle(theme[themeNamespace], heightKey, 'height');
  return height
    ? css`
        height: ${height}px;
      `
    : '';
};

const getWidthStyles = ({ isCompact, theme }) => {
  const widthKey = isCompact ? 'compact' : 'default';
  const width = getThemeStyle(theme[themeNamespace], widthKey, 'width');

  if (!width) {
    return '';
  }
  return typeof width === 'number'
    ? css`
        width: ${width}px;
      `
    : css`
        width: ${width};
      `;
};

// This function is responsible for drawing any focus styles for the element
const getInteractiveStyles = ({
  theme,
  isDisabled,
  isDragging,
  isSelected,
}) => {
  if (isDragging) {
    return css`
      ${getItemState('dragging')} box-shadow: 0 4px 8px -2px ${N60A},
        0 0 1px ${N60A};
    `;
  }

  const standardFocus = css`
    &:focus {
      box-shadow: 0 0 0 2px
        ${getThemeStyle(theme[themeNamespace], 'outline', 'focus')} inset;
      text-decoration: none;
    }
  `;

  if (isDisabled) {
    return css`
      cursor: not-allowed;
      ${getItemState('disabled')} ${standardFocus};
    `;
  }

  if (isSelected) {
    return css`
      ${getItemState('selected')} &:hover {
        ${getItemState('hover')};
      }

      &:active {
        ${getItemState('active')};
      }

      ${standardFocus};
    `;
  }

  return css`
    &:hover {
      ${getItemState('hover')};
    }

    &:active {
      ${getItemState('active')};
    }

    ${standardFocus};
  `;
};

// This is the main item style. It is defined as a basic style variable so it can
// later be applied to different component types (span / a / custom link component)

export const ItemBase = ({ theme }: any) => css`
  && {
    align-items: center;
    border-radius: ${getThemeStyle(theme[themeNamespace], 'borderRadius')}px;
    box-sizing: border-box;
    cursor: pointer;
    display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
    flex: none;
    ${getItemState(
      'default',
    )} ${getPadding} ${getInteractiveStyles} ${getHeightStyles} ${getWidthStyles} &:focus {
      /* focus shadow drawn by getInteractiveStyles */

      outline: none;
      /* relative position prevents bgcolor of a hovered element from
      obfuscating focus ring of a focused sibling element */
      position: relative;
    }
  }
`;

// Given some optional link-related props, returns the relevant styled
// component. For links, it styles the linkComponent if provided, otherwise
// falling back to a styled <a> tag. If no href is present, a styled <span>
// is returned. When we upgrade to styled-components@2.x we will be able to
// simplify this by taking advantage of the withComponent() functionality.
const styledRootElement = ({
  href,
  linkComponent,
}: {
  href?: ?string,
  linkComponent?: any,
}) => {
  if (linkComponent) {
    return styled(linkComponent)`
      ${ItemBase};
    `;
  }
  if (href) {
    return styled.a`
      ${ItemBase};
    `;
  }
  return styled.span`
    ${ItemBase};
  `;
};

export default styledRootElement;