import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { EditorConfig } from './editor-config';
import { PluginsProvider } from '../PluginsProvider';
import { PortalProvider } from '../../react/portals'

export type PMPluginFactoryParams = {
  schema: Schema;
  portalProvider: PortalProvider;
  pluginsProvider: PluginsProvider
};

export type PMPluginCreateConfig = PMPluginFactoryParams & {
  editorConfig: EditorConfig;
};

export type PMPluginFactory = (
  params: PMPluginFactoryParams,
) => Plugin | undefined;

export type PMPlugin = {
  name: string;
  plugin: PMPluginFactory;
};
