// # What do marks exist?
//
// Marks are categorised into different groups. One motivation for this was to allow the `code` mark
// to exclude other marks, without needing to explicitly name them. Explicit naming requires the
// named mark to exist in the schema. This is undesirable because we want to construct different
// schemas that have different sets of nodes/marks.
//
// Groups provide a level of indirection, and solve this problem. For the immediate use-case, one
// group called "not_code" would have sufficed, but this an ultra-specialised to code.

// Mark group for font styling (e.g. bold, italic, underline, superscript).
export const FONT_STYLE = 'fontStyle';

// Marks group for search queries.
export const SEARCH_QUERY = 'searchQuery';

// Marks group for links.
export const LINK = 'link';

// Marks group for colors (text-color, background-color, etc).
export const COLOR = 'color';

// They need to be on their own group so that they can exclude each other
// and also work when one of them is disabled.

// Marks group for alignment.
export const ALIGNMENT = 'alignment';

// Marks group for indentation.
export const INDENTATION = 'indentation';
