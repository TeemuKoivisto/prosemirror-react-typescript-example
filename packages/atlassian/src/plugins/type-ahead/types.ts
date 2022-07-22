import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
// import { InjectedIntl } from 'react-intl';

import { TypeAheadItem } from '../../provider-factory';

import { Dispatch } from '../../utils/event-dispatcher';

// Re-export typeahead types
export type {
  TypeAheadItem,
  TypeAheadItemRenderProps,
} from '../../provider-factory';

export type SelectItemMode =
  | 'shift-enter'
  | 'enter'
  | 'space'
  | 'selected'
  | 'tab';

export type TypeAheadInsert = (
  node?: Node | Object | string,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type TypeAheadSelectItem = (
  state: EditorState,
  item: TypeAheadItem,
  insert: TypeAheadInsert,
  meta: {
    mode: SelectItemMode;
  },
) => Transaction | false;

export type TypeAheadHandler = {
  trigger: string;
  customRegex?: string;
  headless?: boolean;
  forceSelect?: (query: string, items: Array<TypeAheadItem>) => boolean;
  getItems: (
    query: string,
    editorState: EditorState,
    // intl: InjectedIntl,
    meta: {
      prevActive: boolean;
      queryChanged: boolean;
    },
    tr: Transaction,
    dipatch: Dispatch,
  ) => Array<TypeAheadItem> | Promise<Array<TypeAheadItem>>;
  selectItem: TypeAheadSelectItem;
  dismiss?: (state: EditorState) => void;
  getHighlight?: (state: EditorState) => JSX.Element | null;
};

export type TypeAheadItemsLoader = null | {
  promise: Promise<Array<TypeAheadItem>>;
  cancel(): void;
};
