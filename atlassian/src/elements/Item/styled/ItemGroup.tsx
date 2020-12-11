import styled, { css } from 'styled-components';
import { fontSizeSmall } from '../../../theme/constants';
import { getThemeStyle, gridSize, themeNamespace } from '../util/theme';

const getPadding = ({ isCompact, theme } : { isCompact?: boolean, theme: any }) => {
  const paddingType = isCompact ? 'compact' : 'default';
  const { bottom = 0, left = 0, right = 0, top = 0 } = getThemeStyle(
    theme[themeNamespace],
    paddingType,
    'padding',
  );
  return css`
    padding: ${top}px ${right}px ${bottom}px ${left}px;
  `;
};

// eslint-disable-next-line import/prefer-default-export
const GroupTitle = styled.div<{ isCompact?: boolean }>`
  align-items: center;
  color: ${({ theme }) =>
    getThemeStyle(theme[themeNamespace], 'secondaryText', 'default')};
  display: flex;
  flex: 1 1 auto;
  ${getPadding};
`;
GroupTitle.displayName = 'ItemGroupTitle';

const GroupTitleAfter = styled.div`
  flex: 0 0 auto;
  margin-right: -${gridSize / 2}px;
`;
GroupTitleAfter.displayName = 'ItemGroupTitleAfter';

const GroupTitleText = styled.div`
  flex: 1 1 auto;
  font-size: ${fontSizeSmall}px;
  line-height: 1;
  text-transform: uppercase;
  /* Required for children to truncate */
  min-width: 0;
`;
GroupTitleText.displayName = 'ItemGroupTitleText';

export { GroupTitle, GroupTitleAfter, GroupTitleText };