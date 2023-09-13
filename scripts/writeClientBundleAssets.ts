import { denoLoaderPlugins } from "./deps/esbuild/deno_loader.ts";
import { EsbuildPlugin, closeEsbuild, runEsbuild } from "./deps/esbuild/mod.ts";
import { PostcssPlugin, postcssProcessor } from "./deps/postcss/mod.ts";
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
          buildContext.onLoad(
            { filter: /\.css$/, namespace: "css-namespace" },
            async (cssLoaderConfig) => {
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
                  postcssImportPlugin({
                    root: `${Deno.cwd()}/source/client`,
                  })
                )
                .process(Deno.readTextFileSync(cssLoaderConfig.path));
              Deno.writeTextFileSync(
                "./source/client/bundled-assets/SPLASH_PAGE_CSS.ts",
                `export const SPLASH_PAGE_CSS = "${processedCssResult.css.trimEnd()}"`
              );
              return {
                loader: "json",
                contents: JSON.stringify(cssExportMapResult),
              };
            }
          );
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
    "./source/client/bundled-assets/INITIAL_HTML_BUNDLE_JS.ts",
    `export const INITIAL_HTML_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
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
    "./source/client/bundled-assets/APP_BUNDLE_JS.ts",
    `export const APP_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
  );
}

function postcssImportPlugin(arg0: { root: string }): PostcssPlugin {
  throw new Error("Function not implemented.");
}
