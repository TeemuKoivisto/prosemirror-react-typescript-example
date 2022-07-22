import React from 'react';
import { IconProps } from '../types';

export default function IconLayout({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#A5ADBA" x={6} y={6} width={28} height={1} rx={0.5} />
        <rect fill="#A5ADBA" x={6} y={10} width={28} height={1} rx={0.5} />
        <rect fill="#A5ADBA" x={6} y={29} width={28} height={1} rx={0.5} />
        <rect fill="#A5ADBA" x={6} y={33} width={16} height={1} rx={0.5} />
        <rect
          stroke="#4C9AFF"
          strokeWidth={0.5}
          fill="#DEEBFF"
          x={6.25}
          y={14.25}
          width={12.5}
          height={11.5}
          rx={1}
        />
        <rect
          stroke="#4C9AFF"
          strokeWidth={0.5}
          fill="#DEEBFF"
          x={21.25}
          y={14.25}
          width={12.5}
          height={11.5}
          rx={1}
        />
      </g>
    </svg>
  );
}
