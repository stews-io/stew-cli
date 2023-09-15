import { denoLoaderPlugins } from "./deps/esbuild/deno_loader.ts";
import { EsbuildPlugin, Esbuild } from "./deps/esbuild/mod.ts";
import { PostcssPlugin, postcssProcessor } from "./deps/postcss/mod.ts";
import { postcssMinifyPlugin } from "./deps/postcss/postcss-minify.ts";
import { postcssModulesPlugin } from "./deps/postcss/postcss-modules.ts";
import { resolvePath } from "./deps/std/path.ts";

writeClientBundleAssets();

async function writeClientBundleAssets() {
  await bundleAndWriteClientHtml();
  await bundleAndWriteClientApp();
  Esbuild.close();
}

async function bundleAndWriteClientHtml() {
  const bundleClientResult = await Esbuild.runBuild({
    bundle: true,
    write: false,
    platform: "browser",
    format: "iife",
    globalName: "_clientHtml",
    outdir: "out",
    entryPoints: ["./source/client/html/InitialStewHtml.tsx"],
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
  let cssExportMapResult: Record<string, string> = {};
  const minifiedCssResult = await postcssProcessor([
    postcssModulesPlugin({
      generateScopedName: `splash_[hash:base64:6]`,
      getJSON: (cssFilename, nextCssExportMapResult) => {
        cssExportMapResult = nextCssExportMapResult;
      },
    }) as PostcssPlugin,
    postcssMinifyPlugin(),
  ]).process(bundleClientResult.outputFiles[1].text);
  const modifiedCssImportsBundle =
    bundleClientResult.outputFiles[0].text.replaceAll(
      /\s+\/\/.+\.module.css\n\s+var\s.+_default\s\=\s{\n(.+\n)+/g,
      (cssImportString) =>
        Object.keys(cssExportMapResult).reduce(
          (modifiedCssImportStringResult, someStaleImportKey) =>
            modifiedCssImportStringResult.replaceAll(
              someStaleImportKey,
              cssExportMapResult[someStaleImportKey]
            ),
          cssImportString
        )
    );
  const minifyHtmlBundleResult = await Esbuild.runTransform(
    modifiedCssImportsBundle,
    {
      minify: true,
    }
  );
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/INITIAL_HTML_BUNDLE_IIFE.js",
    minifyHtmlBundleResult.code
  );
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/SPLASH_PAGE.css",
    minifiedCssResult.css
  );
}

async function bundleAndWriteClientApp() {
  const bundleClientResult = await Esbuild.runBuild({
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
