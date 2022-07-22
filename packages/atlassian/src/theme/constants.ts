import { css } from 'styled-components';
import { B100, N30A, } from './colors';

export const FLATTENED = '__FLATTENED__';
export const CHANNEL = '__ATLASKIT_THEME__';
export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODES = ['light', 'dark'];

/*
  These theme values are expressed as functions so that if we decide to make
  them dependent on props in the future, it wouldn't require a significant
  refactor everywhere they are being used.
*/
export const borderRadius = () => 3;
export const gridSize = () => 8;
export const fontSize = () => 14;
export const fontSizeSmall = () => 11;
export const fontFamily = () =>
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
export const codeFontFamily = () =>
  `'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace`;

export const focusRing = (
  color: string = B100,
  outlineWidth: number = gridSize() / 4,
) => `
  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px ${outlineWidth}px ${color};
  }
`;

export const noFocusRing = () => `
  box-shadow: none;
`;

export const layers = {
  card: () => 100,
  dialog: () => 300,
  navigation: () => 200,
  layer: () => 400,
  blanket: () => 500,
  modal: () => 510,
  flag: () => 600,
  spotlight: () => 700,
  tooltip: () => 800,
};

export const visuallyHidden = () => ({
  border: '0 !important',
  clip: 'rect(1px, 1px, 1px, 1px) !important',
  height: '1px !important',
  overflow: 'hidden !important' as 'hidden',
  padding: '0 !important',
  position: 'absolute !important' as 'absolute',
  width: '1px !important',
  whiteSpace: 'nowrap !important' as 'nowrap',
});

/**
 * Deprecated Styled Components mixin.
 * Use visuallyHidden instead.
 * @deprecated
 */
export const assistive = () => css`
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  height: 1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
`;

// export const skeletonShimmer = () =>
//   ({
//     css: {
//       backgroundColor: skeletonColor(),
//       animationDuration: '1.5s',
//       animationIterationCount: 'infinite',
//       animationTimingFunction: 'linear',
//       animationDirection: 'alternate',
//     },
//     keyframes: {
//       from: {
//         backgroundColor: skeletonColor(),
//       },
//       to: {
//         backgroundColor: N30A,
//       },
//     },
//   } as const);