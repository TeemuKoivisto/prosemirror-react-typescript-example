import React from 'react';
import { IconProps } from '../types';

export default function IconHeading3({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#C1C7D0" x={6} y={31} width={20} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={28} width={28} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={25} width={28} height={1} rx={0.5} />
        <path
          d="M13.224 9.488h1.92V20h-1.92v-4.352H8.296V20h-1.92V9.488h1.92v4.416h4.928V9.488zM20.8 20.16c-1.712 0-2.736-.32-3.536-.88v-1.776c1.152.736 2.416.896 3.52.896 1.232 0 1.984-.432 1.984-1.504 0-1.104-.752-1.408-2.112-1.408H19.44v-1.472h1.232c1.216 0 1.92-.384 1.92-1.424 0-1.024-.688-1.52-1.92-1.52-.944 0-2.128.208-3.168.768v-1.744c.736-.416 1.776-.768 3.296-.768 2.544 0 3.696 1.296 3.696 2.816 0 1.424-.544 2.32-2.064 2.64 1.68.256 2.24 1.2 2.24 2.384 0 1.616-1.184 2.992-3.872 2.992z"
          fill="#172B4D"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
