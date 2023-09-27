import "npm:postcss";
import "npm:postcss-modules";
import {
  sassPlugin as esbuildSassPlugin,
  postcssModules as esbuildSassPluginCssModulesTransform,
} from "npm:esbuild-sass-plugin";

export function esbuildSassAdapterPlugins() {
  return [
    esbuildSassPlugin({
      filter: /\.module\.scss$/,
      transform: esbuildSassPluginCssModulesTransform({}),
    }),
    esbuildSassPlugin({
      filter: /\.scss$/,
    }),
  ];
}
