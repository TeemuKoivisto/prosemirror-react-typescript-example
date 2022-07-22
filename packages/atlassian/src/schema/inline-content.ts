import { TextDefinition as Text } from './nodes/text';
import { MarksObject } from './marks-obj';
import {
  UnderlineDefinition as Underline,
} from './marks';

/**
 * @name formatted_text_inline_node
 */
export type InlineFormattedText = Text &
  MarksObject<
  Underline // Link | Em | Strong | Strike | SubSup | TextColor | Annotation
  >;
/**
 * @name link_text_inline_node
 */
// export type InlineLinkText = Text & MarksObject<Link>;
/**
 * @name code_inline_node
 */
// export type InlineCode = Text & MarksObject<Code | Link | Annotation>;
/**
 * @name atomic_inline_node
 */
// export type InlineAtomic =
//   | HardBreak
//   | Mention
//   | Emoji
//   | InlineExtension
//   | Date
//   | Placeholder
//   | InlineCard
//   | Status;
/**
 * @name inline_node
 */
export type Inline = InlineFormattedText // | InlineCode | InlineAtomic;
