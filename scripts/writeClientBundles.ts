import {
  build as buildBundle,
  stop as closeEsbuild,
  Plugin,
} from "deno/x/esbuild/mod.js";
import { denoPlugins } from "deno/x/esbuild_deno_loader/mod.ts";
import { resolve } from "deno/std/path/mod.ts";
import postcssProcessor, { AcceptedPlugin } from "npm/postcss";
import postcssImportPlugin from "npm/postcss-import";
import postcssMinifyPlugin from "npm/postcss-minify";
import postcssModulesPlugin from "npm/postcss-modules";
import postcssNestingPlugin from "npm/postcss-nesting";

bundleClientScripts();

async function bundleClientScripts() {
  await bundleAndWriteClientHtml();
  await bundleAndWriteClientApp();
  closeEsbuild();
}

async function bundleAndWriteClientHtml() {
  const bundleClientResult = await buildBundle({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    globalName: "_clientHtml",
    // footer: { js: "_clientHtml.InitialStewHtml;" },
    entryPoints: ["./source/client/html/InitialStewHtml.tsx"],
    plugins: [
      {
        name: "stew-css-esbuild-plugin",
        setup(buildContext) {
          buildContext.onLoad({ filter: /\.css$/ }, async (cssLoaderConfig) => {
            let cssExportMapResult: Record<string, string> = {};
            const processedCssResult = await postcssProcessor([
              postcssNestingPlugin(),
              postcssModulesPlugin({
                getJSON: (cssFilename, nextCssExportMapResult) => {
                  cssExportMapResult = nextCssExportMapResult;
                },
                generateScopedName: `splash_[hash:base64:6]`,
              }) as AcceptedPlugin,
              postcssMinifyPlugin(),
            ])
              .use(
                postcssImportPlugin({
                  root: `${Deno.cwd()}/source/client`,
                })
              )
              .process(Deno.readTextFileSync(cssLoaderConfig.path));
            Deno.writeTextFileSync(
              "./source/client/bundled-assets/SPLASH_PAGE_CSS.ts",
              `export const SPLASH_PAGE_CSS = "${processedCssResult.css
                // .replaceAll('"', '\\"')
                .trimEnd()}"`
            );
            return {
              loader: "json",
              contents: JSON.stringify(cssExportMapResult),
            };
          });
        },
      },
      ...(denoPlugins({
        loader: "portable",
        configPath: resolve(`${Deno.cwd()}/deno.json`),
      }) as Array<Plugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  Deno.writeTextFileSync(
    "./source/client/bundled-assets/INITIAL_HTML_BUNDLE_JS.ts",
    `export const INITIAL_HTML_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
  );
}

async function bundleAndWriteClientApp() {
  const bundleClientResult = await buildBundle({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    entryPoints: ["./source/client/app/main.tsx"],
    plugins: [
      ...(denoPlugins({
        loader: "native",
        configPath: resolve(`${Deno.cwd()}/deno.json`),
      }) as Array<Plugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  Deno.writeTextFileSync(
    "./source/client/bundled-assets/APP_BUNDLE_JS.ts",
    `export const APP_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
  );
}
