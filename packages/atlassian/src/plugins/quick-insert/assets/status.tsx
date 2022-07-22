import React from 'react';
import { IconProps } from '../types';

export default function IconStatus({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <g transform="translate(5 11)">
          <rect fill="#B3D4FF" width={14} height={5} rx={1} />
          <rect fill="#0065FF" x={2} y={2} width={10} height={1} rx={0.5} />
        </g>
        <g transform="translate(5 18)">
          <rect fill="#C3F8DF" width={14} height={5} rx={1} />
          <rect fill="#36B37E" x={2} y={2} width={10} height={1} rx={0.5} />
        </g>
        <g transform="translate(5 25)">
          <rect fill="#DFE1E6" width={14} height={5} rx={1} />
          <rect fill="#8993A4" x={2} y={2} width={10} height={1} rx={0.5} />
        </g>
        <g transform="translate(21 25)">
          <rect fill="#FFD3C8" width={14} height={5} rx={1} />
          <rect fill="#FF5230" x={2} y={2} width={10} height={1} rx={0.5} />
        </g>
        <g transform="translate(21 11)">
          <rect fill="#EAE6FF" width={14} height={5} rx={1} />
          <rect fill="#8777D9" x={2} y={2} width={10} height={1} rx={0.5} />
        </g>
        <g transform="translate(21 18)">
          <rect fill="#FFF0B3" width={14} height={5} rx={1} />
          <rect fill="#FF991F" x={2} y={2} width={10} height={1} rx={0.5} />
        </g>
      </g>
    </svg>
  );
}
