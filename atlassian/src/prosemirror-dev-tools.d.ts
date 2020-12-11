declare module 'prosemirror-dev-tools' {
  import { EditorView } from "prosemirror-view"
  const applyDevTools: (view: EditorView) => void
  export = applyDevTools
}

declare module '@atlaskit/item' {
  import React from 'react'

  interface DnDType {
    draggableProps: Object
    dragHandleProps?: {
      onMouseDown: (e: React.MouseEvent) => void
      onKeyDown: (e: React.KeyboardEvent) => void
    }
    innerRef: (ref: HTMLElement | null) => void
    placeholder?: Node
  }
  
  interface ItemProps {
    /** Whether the Item should attempt to gain browser focus when mounted */
    autoFocus?: boolean
    /** Main content to be shown inside the item. */
    children?: React.ReactNode
    /** Secondary text to be shown underneath the main content. */
    description?: string
    /** Drag and drop props provided by react-beautiful-dnd. Please do not use
     * this unless using react-beautiful-dnd */
    dnd?: DnDType
    /** Content to be shown after the main content. Shown to the right of content (or to the left
     * in RTL mode). */
    elemAfter?: React.ReactNode
    /** Content to be shown before the main content. Shown to the left of content (or to the right
     * in RTL mode). */
    elemBefore?: React.ReactNode
    /** Link that the user will be redirected to when the item is clicked. If omitted a
     *  non-hyperlink component will be rendered. */
    href?: string
    /** Causes the item to be rendered with reduced spacing. */
    isCompact?: boolean
    /** Causes the item to appear in a disabled state and click behaviours will not be triggered. */
    isDisabled?: boolean
    /** Used to apply correct dragging styles when also using react-beautiful-dnd. */
    isDragging?: boolean
    /** Causes the item to still be rendered, but with `display: none` applied. */
    isHidden?: boolean
    /** Causes the item to appear with a persistent selected background state. */
    isSelected?: boolean
    /** Optional function to be used for rendering links. Receives `href` and possibly `target`
     * as props. */
    linkComponent?: Function
    /** Function to be called when the item is clicked, Receives the MouseEvent. */
    onClick?: (e: React.MouseEvent) => void
    /** Function to be called when the item is pressed with a keyboard,
     * Receives the KeyboardEvent. */
    onKeyDown?: (e: React.KeyboardEvent) => void
    /** Standard onmouseenter event */
    onMouseEnter?: (e: React.MouseEvent) => void
    /** Standard onmouseleave event */
    onMouseLeave?: (e: React.MouseEvent) => void
    onMouseMove?: (e: React.MouseEvent) => void
    /** Allows the role attribute of the item to be altered from it's default of
     *  `role="button"` */
    role?: string
    /** Allows the `children` content to break onto a new line, rather than truncating the
     *  content. */
    shouldAllowMultiline?: boolean
    /** Target frame for item `href` link to be aimed at. */
    target?: string
    /** Standard browser title to be displayed on the item when hovered. */
    title?: string
    ref?: (ref: HTMLElement | null) => void
  }
  type ItemGroupProps = {
    /** Items to be shown inside the item group. */
    children?: React.ReactNode
    /** Causes the group title to be rendered with reduced spacing. */
    isCompact?: boolean,
    /** Optional heading text to be shown above the items. */
    title?: Node,
    /** Content to be shown to the right of the heading */
    elemAfter?: Node | string,
    /** A function that returns the DOM ref created by the group */
    innerRef?: Function,
    /** Accessibility role to be applied to the root component */
    role?: string,
    /** Accessibility label - if not provided the title will be used if available */
    label?: Node,
  };
  
  declare const Item: (props: ItemProps) => JSX.Element
  export declare const ItemGroup: (props: ItemGroupProps) => JSX.Element
  export const itemThemeNamespace = '@atlaskit-shared-theme/item'
  export = Item
}
