import { esbuildDenoAdapterPlugins } from "./deps/esbuild/deno-adapter-plugin.ts";
import { Esbuild, EsbuildPlugin, TsconfigRaw } from "./deps/esbuild/mod.ts";
import { postcssMinifyPlugin } from "./deps/postcss/minify-plugin.ts";
import { PostcssPlugin, postcssProcessor } from "./deps/postcss/mod.ts";
import { postcssModulesPlugin } from "./deps/postcss/modules-plugin.ts";
import { resolvePath } from "./deps/std/path.ts";

export interface BundlePreactModuleApi
  extends Pick<BundleModuleApi, "moduleEntryPath"> {}

export async function bundlePreactModule(api: BundlePreactModuleApi) {
  const { moduleEntryPath } = api;
  const bundlePreactModuleResult = await bundleModule({
    moduleEntryPath,
    minifyBundle: false,
    tsConfig: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  let cssExportMapResult: Record<string, string> = {};
  const unminifiedCssBundle = bundlePreactModuleResult.outputFiles[1]
    ? bundlePreactModuleResult.outputFiles[1].text
    : "";
  const minifiedCssResult = await postcssProcessor([
    postcssModulesPlugin({
      generateScopedName: `[hash:base64:7]`,
      getJSON: (cssFilename, nextCssExportMapResult) => {
        cssExportMapResult = nextCssExportMapResult;
      },
    }) as PostcssPlugin,
    postcssMinifyPlugin(),
  ]).process(unminifiedCssBundle);
  const modifiedCssImportsBundleScript =
    bundlePreactModuleResult.outputFiles[0].text.replaceAll(
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
    modifiedCssImportsBundleScript,
    {
      minify: true,
    }
  );
  return [minifyHtmlBundleResult.code, minifiedCssResult.css];
}

export interface BundleModuleApi {
  moduleEntryPath: string;
  minifyBundle: boolean;
  tsConfig: TsconfigRaw;
}

export async function bundleModule(api: BundleModuleApi) {
  const { minifyBundle, moduleEntryPath, tsConfig } = api;
  return await Esbuild.runBuild({
    platform: "browser",
    format: "iife",
    globalName: "__moduleIifeResult",
    outdir: "out",
    bundle: true,
    write: false,
    minify: minifyBundle,
    entryPoints: [moduleEntryPath],
    plugins: [
      ...(esbuildDenoAdapterPlugins({
        loader: "portable",
        configPath: resolvePath(`${Deno.cwd()}/deno.json`),
      }) as Array<EsbuildPlugin>),
    ],
    tsconfigRaw: tsConfig,
  });
}

export interface LoadModuleBundleApi {
  moduleExportKey: string;
  moduleIifeBundleScript: string;
}

export function loadModuleBundle(api: LoadModuleBundleApi) {
  const { moduleIifeBundleScript, moduleExportKey } = api;
  return new Function(
    `${moduleIifeBundleScript}return __moduleIifeResult["${moduleExportKey}"]`
  )();
}
