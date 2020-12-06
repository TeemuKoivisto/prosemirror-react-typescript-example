export class Preset<T extends { name: string }> {
  private plugins: PluginsPreset;

  constructor() {
    this.plugins = [];
  }

  add<PluginFactory>(plugin: PluginConfig<PluginFactory, T>): this {
    this.plugins.push(plugin);
    return this;
  }

  has(plugin: () => T): boolean {
    return this.plugins.some(pluginPreset => {
      if (Array.isArray(pluginPreset)) {
        return pluginPreset[0] === plugin;
      }

      return pluginPreset === plugin;
    });
  }

  getEditorPlugins(excludes?: Set<string>) {
    const editorPlugins = this.processEditorPlugins();
    return this.removeExcludedPlugins(editorPlugins, excludes);
  }

  private processEditorPlugins() {
    const cache = new Map();
    this.plugins.forEach(pluginEntry => {
      if (Array.isArray(pluginEntry)) {
        const [fn, options] = pluginEntry;
        cache.set(fn, options);
      } else {
        /**
         * Prevent usage of same plugin twice without override.
         * [
         *  plugin1,
         *  [plugin1, { option1: value }],
         *  plugin1, // This will throw
         * ]
         */
        if (cache.has(pluginEntry) && cache.get(pluginEntry) === undefined) {
          throw new Error(`${pluginEntry} is already included!`);
        }
        cache.set(pluginEntry, undefined);
      }
    });

    let plugins: Array<T> = [];
    cache.forEach((options, fn) => {
      plugins.push(fn(options));
    });

    return plugins;
  }

  private removeExcludedPlugins(plugins: Array<T>, excludes?: Set<string>) {
    if (excludes) {
      return plugins.filter(plugin => !plugin || !excludes.has(plugin.name));
    }
    return plugins;
  }
}

export type PluginsPreset = Array<PluginConfig<any, any>>;

/**
 * Type for Editor Preset's plugin configuration.
 *
 * Possible configurations:
 * – () => EditorPlugin
 * – (options: any) => EditorPlugin
 * – (options?: any) => EditorPlugin
 *
 * Usage:
 * – preset.add(plugin)
 * – preset.add([plugin])
 * – preset.add([plugin, options])
 *
 *
 * Type:
 * – Plugin with required arguments, matches `() => EditorPlugin` too,
 *   because no arguments has type `unknown`.
 *
 * IF (Args: any) => Editor Plugin:
 *    IF Args === unknown
 *       preset.add(plugin) || preset.add([plugin])
 *    ELSE
 *       IF Args are Optional
 *          preset.add(plugin) | preset.add([plugin]) | preset.add([plugin, options])
 *       ELSE [Args are required]
 *          preset.add([plugin, options])
 * ELSE
 *   never
 */
export type PluginConfig<PluginFactory, T> = PluginFactory extends (
  args: infer Args,
) => T
  ? Exclude<unknown, Args> extends never
    ? PluginFactory | [PluginFactory]
    : Exclude<Args, Exclude<Args, undefined>> extends never
    ? [PluginFactory, Args]
    : PluginFactory | [PluginFactory] | [PluginFactory, Args]
  : never;
