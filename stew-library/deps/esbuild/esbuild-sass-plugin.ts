import "npm:postcss";
import "npm:postcss-modules";
import {
  SassPluginOptions,
  sassPlugin as esbuildSassPlugin,
  postcssModules as esbuildSassPluginCssModulesTransform,
} from "npm:esbuild-sass-plugin";

interface EsbuildSassAdapterPluginsApi
  extends Pick<SassPluginOptions, "type"> {}

export function esbuildSassAdapterPlugins(api: EsbuildSassAdapterPluginsApi) {
  const { type } = api;
  return [
    esbuildSassPlugin({
      type,
      filter: /\.module\.scss$/,
      transform: esbuildSassPluginCssModulesTransform({}),
    }),
    esbuildSassPlugin({
      type,
      filter: /\.scss$/,
    }),
  ];
}
