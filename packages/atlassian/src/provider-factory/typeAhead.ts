import { ReactElement } from 'react';

export type TypeAheadItemRenderProps = {
  onClick: () => void;
  onHover: () => void;
  isSelected: boolean;
};

export type TypeAheadItem = {
  title: string;
  description?: string;
  keyshortcut?: string;
  key?: string | number;
  icon?: () => ReactElement<any>;
  render?: (
    props: TypeAheadItemRenderProps,
  ) => React.ReactElement<TypeAheadItemRenderProps> | null;
  [key: string]: any;
};
