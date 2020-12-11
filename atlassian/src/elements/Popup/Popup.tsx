import React from 'react';

import rafSchedule from 'raf-schd';
import { createPortal } from 'react-dom';

// import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
const akEditorFloatingPanelZIndex = 10

import {
  calculatePlacement,
  calculatePosition,
  findOverflowScrollParent,
  Position,
  validatePosition,
} from './utils';

export interface Props {
  zIndex?: number;
  // The alignments are using the same placements from Popper
  // https://popper.js.org/popper-documentation.html#Popper.placements
  alignX?: 'left' | 'right' | 'center' | 'end';
  alignY?: 'top' | 'bottom' | 'start';
  target?: HTMLElement;
  fitHeight?: number;
  fitWidth?: number;
  boundariesElement?: HTMLElement;
  mountTo?: HTMLElement;
  // horizontal offset, vertical offset
  offset?: number[];
  onPositionCalculated?: (position: Position) => Position;
  onPlacementChanged?: (placement: [string, string]) => void;
  shouldRenderPopup?: (position: Position) => boolean;
  scrollableElement?: HTMLElement;
  stick?: boolean;
  ariaLabel?: string;
  forcePlacement?: boolean;
  allowOutOfBounds?: boolean; // Allow to correct position elements inside table: https://product-fabric.atlassian.net/browse/ED-7191
  rect?: DOMRect;
}

export interface State {
  // Popup Html element reference
  popup?: HTMLElement;

  position?: Position;

  overflowScrollParent: HTMLElement | false;
  validPosition: boolean;
}

export { findOverflowScrollParent } from './utils';
export type { Position } from './utils';

export class Popup extends React.Component<Props, State> {
  scrollElement: undefined | false | HTMLElement;
  static defaultProps = {
    offset: [0, 0],
    allowOutOfBound: false,
  };

  state: State = {
    overflowScrollParent: false,
    validPosition: true,
  };

  private placement: [string, string] = ['', ''];

  /**
   * Calculates new popup position
   */
  private updatePosition(props = this.props, state = this.state) {
    const {
      target,
      fitHeight,
      fitWidth,
      boundariesElement,
      offset,
      onPositionCalculated,
      onPlacementChanged,
      alignX,
      alignY,
      stick,
      forcePlacement,
      allowOutOfBounds,
      rect,
    } = props;
    const { popup } = state;

    if (!target || !popup) {
      return;
    }

    const placement = calculatePlacement(
      target,
      boundariesElement || document.body,
      fitWidth,
      fitHeight,
      alignX,
      alignY,
      forcePlacement,
    );

    if (onPlacementChanged && this.placement.join('') !== placement.join('')) {
      onPlacementChanged(placement);
      this.placement = placement;
    }

    let position = calculatePosition({
      placement,
      popup,
      target,
      stick,
      offset: offset!,
      allowOutOfBounds,
      rect,
    });
    position = onPositionCalculated ? onPositionCalculated(position) : position;

    this.setState({
      position,
      validPosition: validatePosition(target),
    });
  }

  private cannotSetPopup(
    popup: HTMLElement,
    target?: HTMLElement,
    overflowScrollParent?: HTMLElement | false,
  ) {
    /**
     * Check whether:
     * 1. Popup's offset targets which means whether or not its possible to correctly position popup along with given target.
     * 2. Popup is inside "overflow: scroll" container, but its offset parent isn't.
     *
     * Currently Popup isn't capable of position itself correctly in case 2,
     * Add "position: relative" to "overflow: scroll" container or to some other FloatingPanel wrapper inside it.
     */
    return (
      !target ||
      (document.body.contains(target) &&
        popup.offsetParent &&
        !popup.offsetParent.contains(target!)) ||
      (overflowScrollParent &&
        !overflowScrollParent.contains(popup.offsetParent))
    );
  }

  /**
   * Popup initialization.
   * Checks whether it's possible to position popup along given target, and if it's not throws an error.
   */
  private initPopup(popup: HTMLElement) {
    const { target } = this.props;
    const overflowScrollParent = findOverflowScrollParent(popup);

    if (this.cannotSetPopup(popup, target, overflowScrollParent)) {
      return;
    }

    this.setState(
      { popup, overflowScrollParent },
      () => this.scheduledUpdatePosition(this.props),
    );
  }

  private handleRef = (popup: HTMLDivElement) => {
    if (!popup) {
      return;
    }

    this.initPopup(popup);
  };

  private scheduledUpdatePosition = rafSchedule((props: Props) =>
    this.updatePosition(props),
  );

  onResize = () => this.scheduledUpdatePosition(this.props);

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    // We are delaying `updatePosition` otherwise it happens before the children
    // get rendered and we end up with a wrong position
    this.scheduledUpdatePosition(newProps);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    const { stick } = this.props;

    if (stick) {
      this.scrollElement = findOverflowScrollParent(this.props.target!);
    } else {
      this.scrollElement = this.props.scrollableElement;
    }
    if (this.scrollElement) {
      this.scrollElement.addEventListener('scroll', this.onResize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.onResize);
    }
    this.scheduledUpdatePosition.cancel();
  }

  private renderPopup() {
    const { position } = this.state;
    const { shouldRenderPopup } = this.props;

    if (shouldRenderPopup && !shouldRenderPopup(position || {})) {
      return null;
    }

    return (
      <div
        ref={this.handleRef}
        style={{
          position: 'absolute',
          zIndex: this.props.zIndex || akEditorFloatingPanelZIndex,
          ...position,
        }}
        aria-label={this.props.ariaLabel || 'Popup'}
        // Indicates component is an editor pop. Required for focus handling in Message.tsx
        data-editor-popup
      >
        {this.props.children}
      </div>
    );
  }

  render() {
    const { target, mountTo } = this.props;
    const { validPosition } = this.state;

    if (!target || !validPosition) {
      return null;
    }

    if (mountTo) {
      return createPortal(this.renderPopup(), mountTo);
    }

    // Without mountTo property renders popup as is,
    // which means it will be cropped by "overflow: hidden" container.
    return this.renderPopup();
  }
}
