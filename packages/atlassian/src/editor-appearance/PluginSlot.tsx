import React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '../provider-factory';

import { EditorAppearance, UIComponentFactory } from '../types';
import { EventDispatcher } from '../utils/event-dispatcher';
import { EditorActions } from '../EditorActions';

import { whichTransitionEvent } from '../utils/magic-box';

const PluginsComponentsWrapper = styled.div`
  display: flex;
`;

export interface Props {
  items?: Array<UIComponentFactory>;
  editorView?: EditorView;
  editorActions?: EditorActions;
  eventDispatcher?: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance?: EditorAppearance;
  popupsMountPoint?: HTMLElement | null;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  containerElement: HTMLElement | null;
  disabled: boolean;
  contentAreaRef: HTMLElement | null;
}

export default class PluginSlot extends React.Component<Props, any> {
  static displayName = 'PluginSlot';

  transitionEvent = whichTransitionEvent<'transitionend'>();

  shouldComponentUpdate(nextProps: Props) {
    const {
      editorView,
      editorActions,
      items,
      providerFactory,
      eventDispatcher,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
    } = this.props;

    return !(
      nextProps.editorView === editorView &&
      nextProps.editorActions === editorActions &&
      nextProps.items === items &&
      nextProps.providerFactory === providerFactory &&
      nextProps.eventDispatcher === eventDispatcher &&
      nextProps.popupsMountPoint === popupsMountPoint &&
      nextProps.popupsBoundariesElement === popupsBoundariesElement &&
      nextProps.popupsScrollableElement === popupsScrollableElement &&
      nextProps.containerElement === containerElement &&
      nextProps.disabled === disabled
    );
  }

  componentDidMount() {
    this.addModeChangeListener(this.props.contentAreaRef);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.contentAreaRef !== nextProps.contentAreaRef) {
      this.removeModeChangeListener(this.props.contentAreaRef);
      this.addModeChangeListener(nextProps.contentAreaRef);
    }
  }

  componentWillUnmount() {
    this.removeModeChangeListener(this.props.contentAreaRef);
  }

  forceComponentUpdate = (event: TransitionEvent): void => {
    // Only trigger an update if the transition is on a property containing `width`
    // This will cater for media and the content area itself currently.
    if (event.propertyName.includes('width')) {
      this.forceUpdate();
    }
  };

  removeModeChangeListener = (contentAreaRef: HTMLElement | null) => {
    if (contentAreaRef && this.transitionEvent) {
      contentAreaRef.removeEventListener(
        this.transitionEvent,
        this.forceComponentUpdate,
      );
    }
  };

  addModeChangeListener = (contentAreaRef: HTMLElement | null) => {
    if (contentAreaRef && this.transitionEvent) {
      /**
       * Update the plugin components once the transition
       * to full width / default mode completes
       */
      contentAreaRef.addEventListener(
        this.transitionEvent,
        this.forceComponentUpdate,
      );
    }
  };

  render() {
    const {
      items,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
    } = this.props;

    if (!items || !editorView) {
      return null;
    }

    return (
      <PluginsComponentsWrapper>
        {items.map((component, key) => {
          const props: any = { key };
          const element = component({
            editorView: editorView as EditorView,
            editorActions: editorActions as EditorActions,
            eventDispatcher: eventDispatcher as EventDispatcher,
            providerFactory,
            appearance: appearance!,
            popupsMountPoint: popupsMountPoint || undefined,
            popupsBoundariesElement,
            popupsScrollableElement,
            containerElement,
            disabled,
          });
          return element && React.cloneElement(element, props);
        })}
      </PluginsComponentsWrapper>
    );
  }
}
