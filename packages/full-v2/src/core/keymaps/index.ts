import { browser } from '../utils/browser';
import { Command } from '../types/command';

export const toggleBold = makeKeyMapWithCommon('Bold', 'Mod-b');
export const toggleItalic = makeKeyMapWithCommon('Italic', 'Mod-i');
export const toggleUnderline = makeKeyMapWithCommon('Underline', 'Mod-u');
export const toggleCode = makeKeyMapWithCommon('Code', 'Mod-Shift-m');
export const setNormalText = makeKeyMapWithCommon('Normal text', 'Mod-Alt-0');
export const toggleHeading1 = makeKeyMapWithCommon('Heading 1', 'Mod-Alt-1');
export const toggleBlockQuote = makeKeyMapWithCommon('Quote', 'Ctrl-Alt-b');
export const insertNewLine = makeKeyMapWithCommon(
  'Insert new line',
  'Shift-Enter',
);
export const shiftBackspace = makeKeyMapWithCommon(
  'Shift Backspace',
  'Shift-Backspace',
);
export const splitCodeBlock = makeKeyMapWithCommon('Split code block', 'Enter');
export const undo = makeKeyMapWithCommon('Undo', 'Mod-z');
export const moveUp = makeKeyMapWithCommon('Move up', 'ArrowUp');
export const moveDown = makeKeyMapWithCommon('Move down', 'ArrowDown');
export const moveLeft = makeKeyMapWithCommon('Move left', 'ArrowLeft');
export const moveRight = makeKeyMapWithCommon('Move right', 'ArrowRight');
export const redo = makeKeymap('Redo', 'Ctrl-y', 'Cmd-Shift-z');
export const redoBarred = makeKeymap('Redo Barred', 'Ctrl-Shift-z', 'Cmd-y');
export const openHelp = makeKeyMapWithCommon('Open Help', 'Mod-/');
export const addLink = makeKeyMapWithCommon('Link', 'Mod-k');
export const addInlineComment = makeKeyMapWithCommon('Annotate', 'Mod-Alt-c');
export const submit = makeKeyMapWithCommon('Submit Content', 'Mod-Enter');
export const enter = makeKeyMapWithCommon('Enter', 'Enter');
export const shiftEnter = makeKeyMapWithCommon('Shift Enter', 'Shift-Enter');
export const tab = makeKeyMapWithCommon('Tab', 'Tab');
export const backspace = makeKeyMapWithCommon('Backspace', 'Backspace');
export const deleteKey = makeKeyMapWithCommon('Delete', 'Delete');
export const forwardDelete = makeKeymap('Forward Delete', '', 'Ctrl-d');
export const space = makeKeyMapWithCommon('Space', 'Space');
export const escape = makeKeyMapWithCommon('Escape', 'Escape');
export const nextCell = makeKeyMapWithCommon('Next cell', 'Tab');
export const previousCell = makeKeyMapWithCommon('Previous cell', 'Shift-Tab');
export const toggleTable = makeKeyMapWithCommon('Table', 'Shift-Alt-t');
export const cut = makeKeyMapWithCommon('Cut', 'Mod-x');
export const copy = makeKeyMapWithCommon('Copy', 'Mod-c');
export const paste = makeKeyMapWithCommon('Paste', 'Mod-v');
export const altPaste = makeKeyMapWithCommon('Paste', 'Mod-Shift-v');

export const find = makeKeyMapWithCommon('Find', 'Mod-f');

const arrowKeysMap: Record<string, string> = {
  // for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
  ARROWLEFT: '\u2190',
  ARROWRIGHT: '\u2192',
  ARROWUP: '\u2191',
  ARROWDOWN: '\u2193',
};

function formatShortcut(keymap: Keymap): string | undefined {
  let shortcut: string;
  if (browser.mac) {
    // for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
    shortcut = keymap.mac
      .replace(/Cmd/i, '\u2318')
      .replace(/Shift/i, '\u21E7')
      .replace(/Ctrl/i, '\u2303')
      .replace(/Alt/i, '\u2325')
      .replace(/Backspace/i, '\u232B')
      .replace(/Enter/i, '\u23CE');
  } else {
    shortcut = keymap.windows.replace(/Backspace/i, '\u232B');
  }
  const keys = shortcut.split('-');
  let lastKey = keys[keys.length - 1];
  if (lastKey.length === 1) {
    // capitalise single letters
    lastKey = lastKey.toUpperCase();
  }
  keys[keys.length - 1] = arrowKeysMap[lastKey.toUpperCase()] || lastKey;
  return keys.join(browser.mac ? '' : '+');
}

export function tooltip(
  keymap?: Keymap,
  description?: string,
): string | undefined {
  if (keymap) {
    const shortcut = formatShortcut(keymap);
    return description ? `${description} ${shortcut}` : shortcut;
  }
  return;
}

export function findKeymapByDescription(
  description: string,
): Keymap | undefined {
  const matches = ALL.filter(
    keymap => keymap.description.toUpperCase() === description.toUpperCase(),
  );
  return matches[0];
}

export function findShortcutByDescription(
  description: string,
): string | undefined {
  const keymap = findKeymapByDescription(description);
  if (keymap) {
    return findShortcutByKeymap(keymap);
  }
  return;
}

export function findShortcutByKeymap(keymap: Keymap): string | undefined {
  if (browser.mac) {
    return keymap.mac;
  }

  return keymap.windows;
}

const ALL = [
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleCode,
  setNormalText,
  toggleHeading1,
  toggleBlockQuote,
  insertNewLine,
  splitCodeBlock,
  redo,
  undo,
  find,
  escape,
];

function makeKeymap(
  description: string,
  windows: string,
  mac: string,
  common?: string,
): Keymap {
  return {
    description: description,
    windows: windows,
    mac: mac,
    common: common,
  };
}

function makeKeyMapWithCommon(description: string, common: string): Keymap {
  const windows = common.replace(/Mod/i, 'Ctrl');
  const mac = common.replace(/Mod/i, 'Cmd');
  return makeKeymap(description, windows, mac, common);
}

export interface Keymap {
  description: string;
  windows: string;
  mac: string;
  common?: string;
}

export function bindKeymapWithCommand(
  shortcut: string,
  cmd: Command,
  keymap: { [key: string]: Function },
) {
  const oldCmd = keymap[shortcut];
  let newCmd = cmd;
  if (keymap[shortcut]) {
    newCmd = (state, dispatch, editorView) => {
      return oldCmd(state, dispatch) || cmd(state, dispatch, editorView);
    };
  }
  keymap[shortcut] = newCmd;
}

export function findKeyMapForBrowser(keyMap: Keymap): string | undefined {
  if (keyMap) {
    if (browser.mac) {
      return keyMap.mac;
    }

    return keyMap.windows;
  }
  return;
}

export {
  DOWN,
  HEADING_KEYS,
  KEY_0,
  KEY_1,
  KEY_2,
  KEY_3,
  KEY_4,
  KEY_5,
  KEY_6,
  LEFT,
  RIGHT,
  UP,
} from './consts';
