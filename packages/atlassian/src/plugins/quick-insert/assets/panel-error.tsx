import React from 'react';
import { IconProps } from '../types';

export default function IconPanelError({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#FFEBE6" x={8} y={12} width={32} height={16} rx={1} />
        <path
          d="M16.743 19.964l1.06-1.06a.5.5 0 00-.707-.707l-1.06 1.06-1.061-1.06a.5.5 0 00-.707.707l1.06 1.06-1.06 1.061a.5.5 0 10.707.707l1.06-1.06 1.061 1.06a.5.5 0 10.707-.707l-1.06-1.06zM16 24a4 4 0 110-8 4 4 0 010 8z"
          fill="#DE350B"
        />
      </g>
    </svg>
  );
}
