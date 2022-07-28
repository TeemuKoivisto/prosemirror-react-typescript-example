export interface Position {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface CalculatePositionParams {
  placement: [string, string]
  target?: HTMLElement
  popup?: HTMLElement
  offset: number[]
  stick?: boolean
  allowOutOfBounds?: boolean
  rect?: DOMRect
}

export function isBody(elem: HTMLElement | Element): boolean {
  return elem === document.body
}

export function isTextNode(elem: HTMLElement | Element): boolean {
  return elem && elem.nodeType === 3
}

/**
 * Decides if given fitHeight fits below or above the target taking boundaries into account.
 */
export function getVerticalPlacement(
  target: HTMLElement,
  boundariesElement: HTMLElement,
  fitHeight?: number,
  alignY?: string,
  forcePlacement?: boolean
): string {
  if (forcePlacement && alignY) {
    return alignY
  }

  if (!fitHeight) {
    return 'bottom'
  }

  if (isTextNode(target)) {
    target = target.parentElement!
  }

  const boundariesClientRect = boundariesElement.getBoundingClientRect()
  const { height: boundariesHeight } = boundariesClientRect
  const boundariesTop = isBody(boundariesElement) ? 0 : boundariesClientRect.top

  const { top: targetTop, height: targetHeight } = target.getBoundingClientRect()
  const spaceAbove = targetTop - (boundariesTop - boundariesElement.scrollTop)
  const spaceBelow = boundariesTop + boundariesHeight - (targetTop + targetHeight)

  if (spaceBelow >= fitHeight || spaceBelow >= spaceAbove) {
    return 'bottom'
  }

  return 'top'
}

/**
 * Decides if given fitWidth fits to the left or to the right of the target taking boundaries into account.
 */
export function getHorizontalPlacement(
  target: HTMLElement,
  boundariesElement: HTMLElement,
  fitWidth?: number,
  alignX?: string,
  forcePlacement?: boolean
): string {
  if (forcePlacement && alignX) {
    return alignX
  }

  if (!fitWidth) {
    return alignX || 'left'
  }

  if (isTextNode(target)) {
    target = target.parentElement!
  }

  const { left: targetLeft, width: targetWidth } = target.getBoundingClientRect()
  const { left: boundariesLeft, width: boundariesWidth } = boundariesElement.getBoundingClientRect()
  const spaceLeft = targetLeft - boundariesLeft + targetWidth
  const spaceRight = boundariesLeft + boundariesWidth - targetLeft
  if (alignX && spaceLeft > fitWidth && spaceRight > fitWidth) {
    return alignX
  } else if (spaceRight >= fitWidth || (spaceRight >= spaceLeft && !alignX)) {
    return 'left'
  }
  return 'right'
}

export function calculatePlacement(
  target: HTMLElement,
  boundariesElement: HTMLElement,
  fitWidth?: number,
  fitHeight?: number,
  alignX?: string,
  alignY?: string,
  forcePlacement?: boolean
): [string, string] {
  return [
    getVerticalPlacement(target, boundariesElement, fitHeight, alignY, forcePlacement),
    getHorizontalPlacement(target, boundariesElement, fitWidth, alignX, forcePlacement),
  ]
}

const calculateHorizontalPlacement = ({
  placement,
  targetLeft,
  targetRight,
  targetWidth,

  isPopupParentBody,
  popupOffsetParentLeft,
  popupOffsetParentRight,
  popupOffsetParentScrollLeft,
  popupOffsetParentClientWidth,

  popupClientWidth,
  offset,

  allowOutOfBounds = false,
}: {
  placement: string
  targetLeft: number
  targetRight: number
  targetWidth: number

  isPopupParentBody: boolean
  popupOffsetParentLeft: number
  popupOffsetParentRight: number
  popupOffsetParentScrollLeft: number
  popupOffsetParentClientWidth: number

  popupClientWidth: number
  offset: Array<number>

  allowOutOfBounds: boolean
}): Position => {
  const position = {} as Position

  if (placement === 'left') {
    position.left = Math.ceil(
      targetLeft -
        popupOffsetParentLeft +
        (isPopupParentBody ? 0 : popupOffsetParentScrollLeft) +
        offset[0]
    )
  } else if (placement === 'center') {
    position.left = Math.ceil(
      targetLeft -
        popupOffsetParentLeft +
        (isPopupParentBody ? 0 : popupOffsetParentScrollLeft) +
        offset[0] +
        targetWidth / 2 -
        popupClientWidth / 2
    )
  } else if (placement === 'end') {
    const left = Math.ceil(
      targetRight -
        popupOffsetParentLeft +
        (isPopupParentBody ? 0 : popupOffsetParentScrollLeft) +
        offset[0]
    )
    position.left = left
  } else {
    position.right = Math.ceil(
      popupOffsetParentRight -
        targetRight -
        (isPopupParentBody ? 0 : popupOffsetParentScrollLeft) +
        offset[0]
    )
  }
  if (!allowOutOfBounds) {
    if (position.left !== undefined) {
      position.left = getPopupXInsideParent(
        position.left,
        popupClientWidth,
        popupOffsetParentClientWidth
      )
    }
    if (position.right !== undefined) {
      position.right = getPopupXInsideParent(
        position.right,
        popupClientWidth,
        popupOffsetParentClientWidth
      )
    }
  }

  return position
}

const getPopupXInsideParent = (
  x: number,
  popupClientWidth: number,
  popupOffsetParentClientWidth: number
): number => {
  // minimum distance the popup can be from the edge of its parent
  const minPopupMargin = 1
  // prevent going too far right
  if (popupOffsetParentClientWidth < x + popupClientWidth) {
    x = popupOffsetParentClientWidth - popupClientWidth - minPopupMargin
  }
  // prevent going too far left
  return Math.max(minPopupMargin, x)
}

const calculateVerticalStickBottom = ({
  target,
  targetTop,
  targetHeight,

  popup,
  offset,
  position,
}: {
  target: HTMLElement
  targetTop: number
  targetHeight: number

  popup: HTMLElement
  offset: Array<number>
  position: Position
}): Position => {
  const scrollParent = findOverflowScrollParent(target)
  const newPos = { ...position }

  if (scrollParent) {
    const topOffsetTop = targetTop - scrollParent.getBoundingClientRect().top
    const targetEnd = targetHeight + topOffsetTop
    if (
      scrollParent.clientHeight - targetEnd <= popup.clientHeight + offset[1] * 2 &&
      topOffsetTop < scrollParent.clientHeight
    ) {
      const scroll = targetEnd - scrollParent.clientHeight + offset[1] * 2
      let top = newPos.top || 0
      top = top - (scroll + popup.clientHeight)

      newPos.top = top
    }
  }

  return newPos
}

const calculateVerticalStickTop = ({
  target,
  targetTop,
  targetHeight,
  popupOffsetParentHeight,
  popupOffsetParent,

  offset,
  position,
  placement,
}: {
  target: HTMLElement
  targetTop: number
  targetHeight: number
  popupOffsetParentHeight: number
  popupOffsetParent: HTMLElement

  popup: HTMLElement
  offset: Array<number>
  position: Position
  placement: string
}): Position => {
  const scrollParent = findOverflowScrollParent(target)
  const newPos = { ...position }

  if (scrollParent) {
    const { top: scrollParentTop } = scrollParent.getBoundingClientRect()
    const topBoundary = targetTop - scrollParentTop
    const scrollParentScrollTop = scrollParent.scrollTop
    if (topBoundary < 0) {
      const isBelowNodeBoundary =
        targetTop + (scrollParentScrollTop - scrollParentTop) + targetHeight + offset[1] <
        scrollParentScrollTop

      if (placement === 'top') {
        if (isBelowNodeBoundary) {
          newPos.bottom =
            popupOffsetParentHeight - (topBoundary + popupOffsetParent.scrollTop + targetHeight)
        } else {
          newPos.bottom = topBoundary + (newPos.bottom || 0)
        }
      }

      if (placement === 'start') {
        if (isBelowNodeBoundary) {
          newPos.top = topBoundary + popupOffsetParent.scrollTop + targetHeight
        } else {
          newPos.top = Math.abs(topBoundary) + (newPos.top || 0) + offset[1]
        }
      }
    }
  }

  return newPos
}

const calculateVerticalPlacement = ({
  placement,
  targetTop,
  targetHeight,

  isPopupParentBody,

  popupOffsetParentHeight,
  popupOffsetParentTop,
  popupOffsetParentScrollTop,

  borderBottomWidth,
  offset,
}: {
  placement: string
  targetTop: number
  targetHeight: number

  isPopupParentBody: boolean

  popupOffsetParentHeight: number
  popupOffsetParentTop: number
  popupOffsetParentScrollTop: number

  borderBottomWidth: number
  offset: Array<number>
}): Position => {
  const position = {} as Position

  if (placement === 'top') {
    position.bottom = Math.ceil(
      popupOffsetParentHeight -
        (targetTop - popupOffsetParentTop) -
        (isPopupParentBody ? 0 : popupOffsetParentScrollTop) -
        borderBottomWidth +
        offset[1]
    )
  } else if (placement === 'start') {
    position.top = Math.ceil(
      targetTop -
        popupOffsetParentTop -
        offset[1] +
        (isPopupParentBody ? 0 : popupOffsetParentScrollTop)
    )
  } else {
    const top = Math.ceil(
      targetTop -
        popupOffsetParentTop +
        targetHeight +
        (isPopupParentBody ? 0 : popupOffsetParentScrollTop) -
        borderBottomWidth +
        offset[1]
    )
    position.top = top
  }

  return position
}

/**
 * Calculates relative coordinates for placing popup along with the target.
 * Uses placement from calculatePlacement.
 */
export function calculatePosition({
  placement,
  target,
  popup,
  offset,
  stick,
  allowOutOfBounds = false,
  rect,
}: CalculatePositionParams): Position {
  let position: Position = {}

  if (!target || !popup || !popup.offsetParent) {
    return position
  }

  if (isTextNode(target)) {
    target = target.parentElement!
  }

  const popupOffsetParent = popup.offsetParent as HTMLElement
  const offsetParentStyle = popupOffsetParent.style
  let borderBottomWidth = 0
  if (offsetParentStyle && offsetParentStyle.borderBottomWidth) {
    borderBottomWidth = parseInt(offsetParentStyle.borderBottomWidth, 10)
  }
  const [verticalPlacement, horizontalPlacement] = placement

  const {
    top: popupOffsetParentTop,
    left: popupOffsetParentLeft,
    right: popupOffsetParentRight,
    height: popupOffsetParentHeight,
  } = rect ? rect : popupOffsetParent.getBoundingClientRect()

  const {
    top: targetTop,
    left: targetLeft,
    right: targetRight,
    height: targetHeight,
    width: targetWidth,
  } = target.getBoundingClientRect()

  const isPopupParentBody = isBody(popupOffsetParent)

  const verticalPosition = calculateVerticalPlacement({
    placement: verticalPlacement,
    targetTop,
    isPopupParentBody,
    popupOffsetParentHeight,
    popupOffsetParentTop,
    popupOffsetParentScrollTop: popupOffsetParent.scrollTop || 0,
    targetHeight,
    borderBottomWidth,
    offset,
  })

  position = { ...position, ...verticalPosition }
  if ((verticalPlacement === 'top' || verticalPlacement === 'start') && stick) {
    position = calculateVerticalStickTop({
      target,
      targetTop,
      targetHeight,
      popupOffsetParentHeight,
      popupOffsetParent,
      popup,
      offset,
      position,
      placement: verticalPlacement,
    })
  }

  if (verticalPlacement !== 'top' && verticalPlacement !== 'start' && stick) {
    position = calculateVerticalStickBottom({
      target,
      targetTop,
      targetHeight,
      popup,
      offset,
      position,
    })
  }

  const horizontalPosition = calculateHorizontalPlacement({
    placement: horizontalPlacement,
    targetLeft,
    targetRight,
    targetWidth,
    isPopupParentBody,
    popupOffsetParentLeft,
    popupOffsetParentRight,
    popupOffsetParentScrollLeft: popupOffsetParent.scrollLeft || 0,
    popupOffsetParentClientWidth: popup.offsetParent.clientWidth,
    popupClientWidth: popup.clientWidth || 0,
    offset,
    allowOutOfBounds,
  })

  position = { ...position, ...horizontalPosition }

  return position
}

export function validatePosition(popup: HTMLElement): boolean {
  // popup.offsetParent does not exist if the popup element is not mounted
  if (!popup || !popup.offsetParent) {
    return false
  }

  return true
}

/**
 * Traverse DOM Tree upwards looking for popup parents with "overflow: scroll".
 */
export function findOverflowScrollParent(popup: HTMLElement | null): HTMLElement | false {
  let parent: HTMLElement | null = popup

  if (!parent) {
    return false
  }

  while ((parent = parent.parentElement)) {
    // IE11 on Window 8 doesn't show styles from CSS when accessing through element.style property.
    const style = window.getComputedStyle(parent)
    if (
      style.overflow === 'scroll' ||
      style.overflowX === 'scroll' ||
      style.overflowY === 'scroll' ||
      parent.classList.contains('fabric-editor-popup-scroll-parent')
    ) {
      return parent
    }
  }

  return false
}
