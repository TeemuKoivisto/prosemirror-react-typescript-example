import React from 'react';
import { ComponentClass, FunctionComponent, PureComponent } from 'react';
import ReactDOM from 'react-dom';

type SimpleEventHandler<T> = (event: T) => void;

export interface WithOutsideClickProps {
  handleClickOutside?: SimpleEventHandler<MouseEvent>;
  handleEscapeKeydown?: SimpleEventHandler<KeyboardEvent>;
  handleEnterKeydown?: SimpleEventHandler<KeyboardEvent>;
}

export default function withOuterListeners<P>(
  Component: ComponentClass<P> | FunctionComponent<P>,
): ComponentClass<P & WithOutsideClickProps> {
  return class WithOutsideClick extends PureComponent<
    P & WithOutsideClickProps,
    {}
  > {
    componentDidMount() {
      if (this.props.handleClickOutside) {
        document.addEventListener('click', this.handleClick, false);
      }

      if (this.props.handleEscapeKeydown) {
        document.addEventListener('keydown', this.handleKeydown, false);
      }
    }

    componentWillUnmount() {
      if (this.props.handleClickOutside) {
        document.removeEventListener('click', this.handleClick, false);
      }

      if (this.props.handleEscapeKeydown) {
        document.removeEventListener('keydown', this.handleKeydown, false);
      }
    }

    handleClick = (evt: MouseEvent) => {
      const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
      if (
        !domNode ||
        (evt.target instanceof Node && !domNode.contains(evt.target))
      ) {
        if (this.props.handleClickOutside) {
          this.props.handleClickOutside(evt);
        }
      }
    };

    handleKeydown = (evt: KeyboardEvent) => {
      if (evt.code === 'Escape' && this.props.handleEscapeKeydown) {
        this.props.handleEscapeKeydown(evt);
      } else if (evt.code === 'Enter' && this.props.handleEnterKeydown) {
        this.props.handleEnterKeydown(evt);
      }
    };

    render() {
      return <Component {...this.props} />;
    }
  };
}
