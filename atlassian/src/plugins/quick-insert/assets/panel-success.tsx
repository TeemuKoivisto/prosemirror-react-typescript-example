import React from 'react';
import { IconProps } from '../types';

export default function IconPanelSuccess({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#C3F8DF" x={8} y={12} width={32} height={16} rx={1} />
        <path
          d="M15 24a4 4 0 110-8 4 4 0 010 8zm.682-5.482l-1.076 2.055-.772-.695a.5.5 0 00-.668.744l1.25 1.125a.5.5 0 00.777-.14l1.375-2.625a.5.5 0 00-.886-.464z"
          fill="#00875A"
        />
      </g>
    </svg>
  );
}
