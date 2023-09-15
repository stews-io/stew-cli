import { denoLoaderPlugins } from "./deps/esbuild/deno_loader.ts";
import { EsbuildPlugin, closeEsbuild, runEsbuild } from "./deps/esbuild/mod.ts";
import { PostcssPlugin, postcssProcessor } from "./deps/postcss/mod.ts";
import { postcssImportTransformer } from "./deps/postcss/postcss-import.ts";
import { postcssMinifyPlugin } from "./deps/postcss/postcss-minify.ts";
import { postcssModulesPlugin } from "./deps/postcss/postcss-modules.ts";
import { postcssNestingPlugin } from "./deps/postcss/postcss-nesting.ts";
import { resolvePath } from "./deps/std/path.ts";

writeClientBundleAssets();

async function writeClientBundleAssets() {
  await bundleAndWriteClientHtml();
  await bundleAndWriteClientApp();
  closeEsbuild();
}

async function bundleAndWriteClientHtml() {
  const bundleClientResult = await runEsbuild({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    globalName: "_clientHtml",
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
              }) as PostcssPlugin,
              postcssMinifyPlugin(),
            ])
              .use(
                postcssImportTransformer({
                  root: `${Deno.cwd()}/source/client`,
                })
              )
              .process(Deno.readTextFileSync(cssLoaderConfig.path));
            Deno.writeTextFileSync(
              "./source/client/__bundled-assets__/SPLASH_PAGE.css",
              processedCssResult.css
            );
            return {
              loader: "json",
              contents: JSON.stringify(cssExportMapResult),
            };
          });
        },
      },
      ...(denoLoaderPlugins({
        loader: "portable",
        configPath: resolvePath(`${Deno.cwd()}/deno.json`),
      }) as Array<EsbuildPlugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/INITIAL_HTML_BUNDLE_IIFE.js",
    bundleClientResult.outputFiles[0].text
  );
}

async function bundleAndWriteClientApp() {
  const bundleClientResult = await runEsbuild({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    entryPoints: ["./source/client/app/main.tsx"],
    plugins: [
      ...(denoLoaderPlugins({
        loader: "portable",
        configPath: resolvePath(`${Deno.cwd()}/deno.json`),
      }) as Array<EsbuildPlugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/APP_BUNDLE_IIFE.js",
    bundleClientResult.outputFiles[0].text
  );
}
