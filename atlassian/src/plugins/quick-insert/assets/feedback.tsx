import React from 'react';
import { IconProps } from '../types';

export default function IconFeedback({ label = '' }: IconProps) {
  return (
    <svg aria-label={label} width={40} height={40}>
      <defs>
        <linearGradient
          x1="46.01%"
          y1="100%"
          x2="17.216%"
          y2="0%"
          id="feedback-a"
        >
          <stop stopColor="#C1C7D0" offset="0%" />
          <stop stopColor="#EDEFF2" offset="44.72%" />
          <stop stopColor="#FAFBFC" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M0 0h40v40H0z" />
        <ellipse
          fill="#0065FF"
          fillRule="nonzero"
          cx={14.368}
          cy={24.274}
          rx={3.145}
          ry={3.157}
        />
        <path
          d="M14.368 13.866V34.92c-2.928 0-5.302-2.383-5.302-5.323v-.26c0-2.444-1.155-4.71-3.043-6.252C4.854 22.131 4 20.686 4 19.07c0-2.874 2.321-5.204 5.184-5.204h5.184z"
          fill="#CFD4DB"
          fillRule="nonzero"
        />
        <ellipse
          fill="#0065FF"
          fillRule="nonzero"
          cx={32.744}
          cy={19.07}
          rx={3.189}
          ry={3.201}
        />
        <path
          d="M32.744 31.62a.517.517 0 11-.901.351 23.706 23.706 0 00-17.475-7.697V13.866c6.64 0 12.978-2.79 17.475-7.696a.517.517 0 01.9.351V31.62z"
          fill="url(#feedback-a)"
          fillRule="nonzero"
        />
        <path
          d="M27.647 28.35c.507.343 1 .706 1.482 1.088V8.702c-.48.383-.975.746-1.482 1.089V28.35z"
          fill="#FF5230"
          fillRule="nonzero"
        />
        <path
          d="M9.184 13.866h5.184v10.408H9.184C6.321 24.274 4 21.944 4 19.07c0-2.874 2.321-5.204 5.184-5.204z"
          fill="#0065FF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
