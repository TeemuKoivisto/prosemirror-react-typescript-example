import React from 'react';
import { IconProps } from '../types';

export default function IconHeading4({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#C1C7D0" x={6} y={30} width={20} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={27} width={28} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={24} width={28} height={1} rx={0.5} />
        <path
          d="M11.804 9.802h2.254V19h-2.254v-3.57H8.206V19H5.952V9.802h2.254v3.654h3.598V9.802zm6.188 4.186l-1.246 1.68a33.67 33.67 0 012.646-.098v-3.78c-.476.812-.994 1.638-1.4 2.198zM21.52 19h-2.24v-1.666h-4.116v-1.946l4.116-5.586h2.24v5.768h1.05v1.764h-1.05V19z"
          fill="#172B4D"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
