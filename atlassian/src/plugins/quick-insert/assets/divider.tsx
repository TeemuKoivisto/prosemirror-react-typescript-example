import React from 'react';
import { IconProps } from '../types';

export default function IconDivider({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#C1C7D0" x={6} y={19} width={28} height={2} rx={1} />
        <rect fill="#C1C7D0" x={12} y={14} width={16} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={12} y={11} width={16} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={12} y={8} width={16} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={12} y={31} width={9} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={12} y={28} width={16} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={12} y={25} width={16} height={1} rx={0.5} />
      </g>
    </svg>
  );
}
