import React from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorActions } from '../EditorActions'
import { EventDispatcher } from '../utils/event-dispatcher'
import { ProviderFactory } from '../provider-factory'

export type EditorAppearance = 'full-page'

export enum ToolbarSize {
  XXL = 6,
  XL = 5,
  L = 4,
  M = 3,
  S = 2,
  XXXS = 1,
}

export type ToolbarUiComponentFactoryParams = UiComponentFactoryParams & {
  toolbarSize: ToolbarSize
  isToolbarReducedSpacing: boolean
  isLastItem?: boolean
}
export type ToolbarUIComponentFactory = (
  params: ToolbarUiComponentFactoryParams
) => React.ReactElement<any> | null

export type UiComponentFactoryParams = {
  editorView: EditorView
  editorActions: EditorActions
  eventDispatcher: EventDispatcher
  providerFactory: ProviderFactory
  appearance: EditorAppearance
  popupsMountPoint?: HTMLElement
  popupsBoundariesElement?: HTMLElement
  popupsScrollableElement?: HTMLElement
  containerElement: HTMLElement | null
  disabled: boolean
}
export type UIComponentFactory = (
  params: UiComponentFactoryParams
) => React.ReactElement<any> | null
