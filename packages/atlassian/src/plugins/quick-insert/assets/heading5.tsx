import React from 'react';
import { IconProps } from '../types';

export default function IconHeading5({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#C1C7D0" x={6} y={30} width={20} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={27} width={28} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={24} width={28} height={1} rx={0.5} />
        <path
          d="M10.832 11.116h1.932V19h-1.932v-3.06H7.748V19H5.816v-7.884h1.932v3.132h3.084v-3.132zm6.024 8.016c-1.152 0-2.124-.252-2.796-.684v-1.716a5.307 5.307 0 002.676.744c.852 0 1.308-.288 1.308-.984 0-.744-.456-.984-1.2-.984-.396 0-.816.096-1.176.24l-1.308-.504v-4.128h5.124v1.644h-3.48v1.896c.372-.168.852-.288 1.452-.288 1.656 0 2.4.9 2.4 2.304 0 1.476-.924 2.46-3 2.46z"
          fill="#172B4D"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
