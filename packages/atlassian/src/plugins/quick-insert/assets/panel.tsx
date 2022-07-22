import React from 'react';
import { IconProps } from '../types';

export default function IconPanel({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#DEEBFF" x={8} y={12} width={32} height={16} rx={1} />
        <path
          d="M12 20a4 4 0 108 0 4 4 0 00-8 0z"
          fill="#0052CC"
          fillRule="nonzero"
        />
        <rect
          fill="#FFF"
          fillRule="nonzero"
          x={15.556}
          y={19.722}
          width={1}
          height={2.2}
          rx={0.5}
        />
        <circle fill="#FFF" fillRule="nonzero" cx={16} cy={18.444} r={1} />
      </g>
    </svg>
  );
}
