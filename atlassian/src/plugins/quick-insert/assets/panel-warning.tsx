import React from 'react';
import { IconProps } from '../types';

export default function IconPanelWarning({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#FFF0B3" x={8} y={12} width={32} height={16} rx={1} />
        <path
          d="M16.847 16.83l2.808 5.73a1 1 0 01-.898 1.44h-6.514a1 1 0 01-.898-1.44l2.808-5.73a1.5 1.5 0 012.694 0zm-1.347.46a.568.568 0 00-.564.635l.278 2.32a.288.288 0 00.572 0l.278-2.32a.568.568 0 00-.564-.635zm0 5.035c.318 0 .576-.293.576-.656 0-.362-.258-.656-.576-.656-.318 0-.576.294-.576.656 0 .363.258.656.576.656z"
          fill="#FF8B00"
        />
      </g>
    </svg>
  );
}
