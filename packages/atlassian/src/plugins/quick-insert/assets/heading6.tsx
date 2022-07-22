import React from 'react';
import { IconProps } from '../types';

export default function IconHeading6({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <rect fill="#C1C7D0" x={6} y={30} width={20} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={27} width={28} height={1} rx={0.5} />
        <rect fill="#C1C7D0" x={6} y={24} width={28} height={1} rx={0.5} />
        <path
          d="M12.675 19h-1.622v-3.239H7.562V19H5.94v-7.75h1.622v3.125h3.491V11.25h1.622V19zm4.878.199c-1.122 0-2.025-.494-2.556-1.402-.43-.66-.65-1.552-.65-2.616 0-2.573 1.213-4.13 3.233-4.13 1.472 0 2.616.87 2.836 2.164H18.81c-.15-.51-.634-.832-1.24-.832-1.064 0-1.709 1.026-1.677 2.632h.097c.355-.73 1.074-1.144 1.977-1.144 1.471 0 2.551 1.09 2.551 2.572 0 1.612-1.23 2.756-2.965 2.756zm-.016-1.332c.795 0 1.407-.596 1.407-1.375 0-.79-.59-1.37-1.402-1.37-.81 0-1.407.58-1.407 1.354 0 .79.607 1.39 1.402 1.39z"
          fill="#97A0AF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
