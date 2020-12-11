import React from 'react'
import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';

import DevIcon from '@atlaskit/icon/glyph/editor/code'

import { TypeAheadItem } from './typeAhead';

export type QuickInsertActionInsert = (
  node?: Node | Record<string, any> | string,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type QuickInsertItemId =
  | 'hyperlink'
  | 'table'
  | 'helpdialog'
  | 'date'
  | 'media'
  | 'blockquote'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'codeblock'
  | 'unorderedList'
  | 'feedbackdialog'
  | 'orderedList'
  | 'rule'
  | 'status'
  | 'mention'
  | 'emoji'
  | 'action'
  | 'decision'
  | 'infopanel'
  | 'notepanel'
  | 'successpanel'
  | 'warningpanel'
  | 'errorpanel'
  | 'layout'
  | 'expand';

export type QuickInsertItem = TypeAheadItem & {
  /** other names used to find the item */
  keywords?: Array<string>;
  /** categories where to find the item */
  categories?: Array<string>;
  /** optional sorting priority */
  priority?: number;
  /** optional identifier */
  id?: QuickInsertItemId;
  /** indicates if the item will be highlighted where approppriated (plus menu for now) */
  featured?: boolean;
  /** what to do on insert */
  action: (
    insert: QuickInsertActionInsert,
    state: EditorState,
  ) => Transaction | false;
};

export type QuickInsertProvider = {
  getItems: () => Promise<Array<QuickInsertItem>>;
};

export function quickInsertProviderFactory(): QuickInsertProvider {
  return {
    getItems() {
      return new Promise(resolve => {
        window.setTimeout(() => resolve(quickInsertItems), 1000);
      });
    },
  };
}

const quickInsertItems: QuickInsertItem[] = [
    {
      title: 'Minimum width extension',
      icon: () => <DevIcon label="dev" />,
      action(insert) {
        return insert({
          type: 'extension',
          attrs: {
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'block-layout-eh',
            text: 'Minimum width block extension demo',
            parameters: {
              style: { minWidth: 400 },
            },
          },
        });
      },
    },
    {
      title: 'Lorem ipsum',
      icon: () => <DevIcon label="dev" />,
      action(insert) {
        return insert({
          type: 'paragraph',
          content: [],
        }).insertText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
        );
      },
    },
  ]
