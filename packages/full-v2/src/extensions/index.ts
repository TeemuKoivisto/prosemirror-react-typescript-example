import { createReactExtension } from './createReactExtension'

import { BaseExtension, baseSchema } from './base'
import type { BaseExtensionProps } from './base'
import { BlockQuoteExtension, blockQuoteSchema } from './blockquote'
import type { BlockQuoteExtensionProps } from './blockquote'
import { CollabExtension } from './collab'
import type { CollabExtensionProps } from './collab'

export const Base = createReactExtension<BaseExtensionProps>(BaseExtension)
export const BlockQuote = createReactExtension<BlockQuoteExtensionProps>(BlockQuoteExtension)
export const Collab = createReactExtension<CollabExtensionProps>(CollabExtension)

export { BaseExtension } from './base'
export type { BaseState } from './base'
export { BlockQuoteExtension } from './blockquote'
export type { BlockQuoteState } from './blockquote'
export { CollabExtension } from './collab'
export type { CollabState } from './collab'

export { Extension } from './Extension'

import { createSchemaFromSpecs } from './createSchema'
export const createDefaultSchema = () => createSchemaFromSpecs([baseSchema, blockQuoteSchema])
export { createSchema } from './createSchema'
export { createPlugins } from './createPlugins'
