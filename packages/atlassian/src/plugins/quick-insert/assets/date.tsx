import React from 'react';
import { IconProps } from '../types';

export default function IconDate({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <defs>
        <linearGradient
          x1="100.699%"
          y1="50%"
          x2="-14.52%"
          y2="50%"
          id="date-a"
        >
          <stop stopColor="#FAFBFC" offset="0%" />
          <stop stopColor="#F4F6F8" stopOpacity={0.859} offset="12.52%" />
          <stop stopColor="#E3E6EA" stopOpacity={0.402} offset="54.65%" />
          <stop stopColor="#D7DCE1" stopOpacity={0.113} offset="83.66%" />
          <stop stopColor="#D3D8DE" stopOpacity={0} offset="97.03%" />
        </linearGradient>
        <linearGradient x1="50%" y1="4.543%" x2="50%" y2="100%" id="date-b">
          <stop stopColor="#FF7043" offset="0%" />
          <stop stopColor="#FF5630" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <g transform="translate(8 7)">
          <path d="M0 8h24v14a2 2 0 01-2 2H2a2 2 0 01-2-2V8z" fill="#EBECF0" />
          <path
            d="M18.109 17.42c-2.877-1.466-5.608-.66-9.359-1.604C6.18 15.17 2.987 13.661 0 10v13.913h22.294c-.353-2.421-1.384-5.065-4.185-6.493z"
            fill="url(#date-a)"
            fillRule="nonzero"
            opacity={0.37}
            style={{
              mixBlendMode: 'screen',
            }}
          />
          <path
            d="M1 2h22a1 1 0 011 1v7H0V3a1 1 0 011-1z"
            fill="url(#date-b)"
          />
          <rect fill="#0065FF" x={5} width={2} height={6} rx={1} />
          <rect fill="#0065FF" x={17} width={2} height={6} rx={1} />
          <path
            fill="#C1C7D0"
            d="M4 13h4v3H4zm0 5h4v3H4zm6 0h4v3h-4zm0-5h4v3h-4zm6 5h4v3h-4zm0-5h4v3h-4z"
          />
        </g>
      </g>
    </svg>
  );
}
