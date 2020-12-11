/* eslint-disable react/prop-types */
import React from 'react';
// import textContent from 'react-addons-text-content';

import {
  GroupTitle,
  GroupTitleText,
  GroupTitleAfter,
} from './styled/ItemGroup';

interface ItemGroupProps {
  /** Items to be shown inside the item group. */
  children?: React.ReactNode
  /** Causes the group title to be rendered with reduced spacing. */
  isCompact?: boolean
  /** Optional heading text to be shown above the items. */
  title?: React.ReactText
  /** Content to be shown to the right of the heading */
  elemAfter?: React.ReactNode
  /** A function that returns the DOM ref created by the group */
  innerRef?: React.RefObject<any>
  /** Accessibility role to be applied to the root component */
  role?: string
  /** Accessibility label - if not provided the title will be used if available */
  label?: React.ReactText
}

export default class ItemGroup extends React.Component<ItemGroupProps> {
  static defaultProps = {
    role: 'group',
  };

  render() {
    const {
      children,
      elemAfter,
      isCompact,
      title,
      label,
      innerRef,
      role,
    } = this.props;

    const ariaLabel = label ?? title ?? ''
    return (
      <div aria-label={ariaLabel.toString()} role={role} ref={innerRef}>
        {title ? (
          <GroupTitle aria-hidden="true" isCompact={isCompact}>
            <GroupTitleText>{title}</GroupTitleText>
            {elemAfter ? (
              <GroupTitleAfter>
                {elemAfter}
              </GroupTitleAfter>
            ) : null}
          </GroupTitle>
        ) : null}
        {children}
      </div>
    );
  }
}