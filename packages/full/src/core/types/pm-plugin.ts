import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { EditorConfig } from './editor-config';
import { EditorContext } from '../EditorContext';

export type PMPluginFactoryParams = {
  schema: Schema;
  ctx: EditorContext
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
