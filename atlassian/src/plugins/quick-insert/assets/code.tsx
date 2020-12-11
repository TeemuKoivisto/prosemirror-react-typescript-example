import React from 'react';
import { IconProps } from '../types';

export default function IconCode({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40} fillRule="evenodd">
      <path fill="#fff" d="M0 0h40v40H0z" />
      <path fill="#ebecf0" d="M13 6h26v28H13z" />
      <path d="M9 6h4v28H9a2 2 0 01-2-2V8a2 2 0 012-2z" fill="#dfe1e6" />
      <g fill="#a5adba">
        <rect x={9} y={9} width={2} height={1} rx={0.5} />
        <rect x={16} y={9} width={9} height={1} rx={0.5} />
        <rect x={22} y={21} width={9} height={1} rx={0.5} />
        <rect x={22} y={29} width={9} height={1} rx={0.5} />
      </g>
      <g fill="#4c9aff">
        <rect x={28} y={25} width={9} height={1} rx={0.5} />
        <rect x={16} y={13} width={13} height={1} rx={0.5} />
      </g>
      <g fill="#ff7452">
        <rect x={16} y={17} width={13} height={1} rx={0.5} />
        <rect x={19} y={25} width={7} height={1} rx={0.5} />
      </g>
      <g fill="#a5adba">
        <rect x={9} y={13} width={2} height={1} rx={0.5} />
        <rect x={9} y={17} width={2} height={1} rx={0.5} />
        <rect x={9} y={21} width={2} height={1} rx={0.5} />
        <rect x={9} y={25} width={2} height={1} rx={0.5} />
        <rect x={9} y={29} width={2} height={1} rx={0.5} />
      </g>
    </svg>
  );
}
