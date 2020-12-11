import React from 'react';
import { IconProps } from '../types';

export default function IconAction({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <g transform="translate(7 10)">
          <path d="M3 0h30v20H3a3 3 0 01-3-3V3a3 3 0 013-3z" fill="#ECEDF0" />
          <rect fill="#0052CC" x={5} y={5} width={10} height={10} rx={2} />
          <path
            d="M8.81 12.365l.05.055a.5.5 0 00.77-.042l.048-.065 3.11-4.205a.666.666 0 00-.09-.886.554.554 0 00-.82.098l-2.703 3.655-1.096-1.184a.553.553 0 00-.825 0 .667.667 0 000 .892l1.556 1.682z"
            fill="#FFF"
          />
          <path d="M20 9h13v2H20a1 1 0 010-2z" fill="#C1C7D0" />
        </g>
      </g>
    </svg>
  );
}
