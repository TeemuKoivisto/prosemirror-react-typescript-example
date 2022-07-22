import Fuse from 'fuse.js';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { QuickInsertItem } from '../../provider-factory';
import { QuickInsertPluginState, QuickInsertPluginOptions } from './types';

const options = {
  threshold: 0.3,
  keys: [
    // Weights must sum to <= 1.0
    { name: 'title', weight: 0.5 },
    { name: 'priority', weight: 0.3 },
    { name: 'keywords', weight: 0.15 },
    { name: 'description', weight: 0.04 },
    { name: 'keyshortcut', weight: 0.01 },
  ],
};

function dedupe<T>(
  list: T[] = [],
  iteratee: (p: T) => T[keyof T] | T = p => p,
): T[] {
  /**
              .,
    .      _,'f----.._
    |\ ,-'"/  |     ,'
    |,_  ,--.      /
    /,-. ,'`.     (_
    f  o|  o|__     "`-.
    ,-._.,--'_ `.   _.,-`
    `"' ___.,'` j,-'
      `-.__.,--'
    Gotta go fast!
 */

  const seen = new Set();
  list.forEach(l => seen.add(iteratee(l)));

  return list.filter(l => {
    const it = iteratee(l);
    if (seen.has(it)) {
      seen.delete(it);
      return true;
    }
    return false;
  });
}

export function find(query: string, items: QuickInsertItem[]) {
  const fuse = new Fuse(items, options);
  if (query === '') {
    // Copy and sort list by priority
    return items
      .slice(0)
      .sort(
        (a, b) =>
          (a.priority || Number.POSITIVE_INFINITY) -
          (b.priority || Number.POSITIVE_INFINITY),
      );
  }
  return fuse.search(query).map(s => s.item)
}

export const searchQuickInsertItems = (
  quickInsertState: QuickInsertPluginState,
  options?: QuickInsertPluginOptions,
) => (query?: string, category?: string): QuickInsertItem[] => {
  const defaultItems =
    options && options.disableDefaultItems
      ? []
      : quickInsertState.lazyDefaultItems();
  const providedItems = quickInsertState.providedItems;

  const items = providedItems
    ? dedupe([...defaultItems, ...providedItems], item => item.title)
    : defaultItems;

  return find(
    query || '',
    items
  );
};

export const getFeaturedQuickInsertItems = (
  { providedItems, lazyDefaultItems }: QuickInsertPluginState,
  options?: QuickInsertPluginOptions,
) => (): QuickInsertItem[] => {
  const defaultItems =
    options && options.disableDefaultItems ? [] : lazyDefaultItems();

  const items = providedItems
    ? dedupe([...defaultItems, ...providedItems], item => item.title)
    : defaultItems;

  return items.filter(item => item.featured);
};
