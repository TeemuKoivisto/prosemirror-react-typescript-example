/* eslint-disable react/prop-types */
import React from 'react'

import styledRootElement from './styled/Item'
import { Before, After, Content, ContentWrapper, Description } from './styled/ItemParts'

interface DnDType {
  draggableProps: Object
  dragHandleProps?: {
    onMouseDown: (e: React.MouseEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }
  ref: (ref: HTMLElement | null) => void
  placeholder?: Node
}

interface Props {
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
  linkComponent?: () => JSX.Element
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
  ref?: any // React.RefObject<any>
  // ref?: (ref: HTMLElement | null) => void
}

export default class Item extends React.Component<Props> {
  static defaultProps = {
    autoFocus: false,
    description: '',
    isCompact: false,
    isDisabled: false,
    isHidden: false,
    role: 'button',
    shouldAllowMultiline: false,
  }

  rootComponent: React.ComponentType<any>

  // eslint-disable-next-line react/sort-comp
  ref: React.ElementRef<any> | null

  constructor(props: Props) {
    super(props)

    // The type of element rendered at the root of render() can vary based on the `href`
    // and `linkComponent` props provided. We generate this component here to avoid re-
    // generating the component inside render(). This is for performance reasons, and also
    // allows us to avoid generating a new `ref` for the root element each render().
    this.rootComponent = styledRootElement({
      href: this.href(),
      linkComponent: props.linkComponent,
    })
    this.ref = React.createRef()
  }

  componentDidMount() {
    if (this.ref && this.props.autoFocus) {
      //@ts-ignore
      this.ref!.focus()
    }
  }

  setRef = (ref: HTMLElement | null) => {
    this.ref = ref
  }

  href = () => (this.props.isDisabled ? null : this.props.href)

  render() {
    const {
      onClick,
      onKeyDown,
      isCompact,
      isDisabled,
      isDragging,
      isHidden,
      isSelected,
      onMouseEnter,
      onMouseLeave,
      role,
      dnd,
      ...otherProps
    } = this.props

    const { rootComponent: Root } = this
    const dragHandleProps = (dnd && dnd.dragHandleProps) || null

    const patchedEventHandlers = {
      onClick: (event: React.MouseEvent) => {
        // rbd will use event.preventDefault() to block clicks that are used
        // as a part of the drag and drop lifecycle.
        if (event.defaultPrevented) {
          return
        }

        if (!isDisabled && onClick) {
          onClick(event)
        }
      },
      onMouseDown: (event: React.MouseEvent) => {
        // rbd 11.x support
        if (dragHandleProps && dragHandleProps.onMouseDown) {
          dragHandleProps.onMouseDown(event)
        }
        // We want to prevent the item from getting focus when clicked
        event.preventDefault()
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        // swallowing keyboard events on the element while dragging
        // rbd should already be doing this - but we are being really clear here
        if (isDragging) {
          return
        }

        // rbd 11.x support
        if (dragHandleProps && dragHandleProps.onKeyDown) {
          dragHandleProps.onKeyDown(event)
        }

        // if default is prevented - do not fire other handlers
        // this can happen if the event is used for drag and drop by rbd
        if (event.defaultPrevented) {
          return
        }

        // swallowing event if disabled
        if (isDisabled) {
          return
        }

        if (!onKeyDown) {
          return
        }

        onKeyDown(event)
      },
    }

    const patchedInnerRef = (ref: HTMLElement | null) => {
      this.setRef(ref)
      // give rbd the inner ref too
      if (dnd && dnd.ref) {
        dnd.ref(ref)
      }
    }

    return (
      <Root
        aria-disabled={isDisabled}
        href={this.href()}
        isCompact={isCompact}
        isDisabled={isDisabled}
        isDragging={isDragging}
        isHidden={isHidden}
        isSelected={isSelected}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={role}
        tabIndex={isDisabled || isHidden || this.props.href ? null : 0}
        target={this.props.target}
        title={this.props.title}
        ref={patchedInnerRef}
        {...(dnd && dnd.draggableProps)}
        {...dragHandleProps}
        {...patchedEventHandlers}
        {...otherProps}
      >
        {!!this.props.elemBefore && <Before isCompact={isCompact}>{this.props.elemBefore}</Before>}
        <ContentWrapper>
          <Content allowMultiline={this.props.shouldAllowMultiline}>{this.props.children}</Content>
          {!!this.props.description && (
            <Description isCompact={this.props.isCompact} isDisabled={this.props.isDisabled}>
              {this.props.description}
            </Description>
          )}
        </ContentWrapper>
        {!!this.props.elemAfter && <After isCompact={isCompact}>{this.props.elemAfter}</After>}
      </Root>
    )
  }
}
