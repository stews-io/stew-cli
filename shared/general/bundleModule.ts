import { esbuildDenoAdapterPlugins } from "../deps/esbuild/deno-adapter-plugin.ts";
import { esbuildSassAdapterPlugins } from "../deps/esbuild/esbuild-sass-plugin.ts";
import { Esbuild, EsbuildPlugin, TsconfigRaw } from "../deps/esbuild/mod.ts";
import { resolvePath } from "../deps/std/path.ts";

export interface BundlePreactModuleApi
  extends Pick<BundleModuleApi, "moduleEntryPath"> {}

export async function bundlePreactModule(api: BundlePreactModuleApi) {
  const { moduleEntryPath } = api;
  const bundlePreactModuleResult = await bundleModule({
    moduleEntryPath,
    additionalEsbuildPlugins: esbuildSassAdapterPlugins(),
    tsConfig: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  return [
    bundlePreactModuleResult.outputFiles[0].text,
    bundlePreactModuleResult.outputFiles[1]
      ? bundlePreactModuleResult.outputFiles[1].text
      : "",
  ];
}

export interface BundleModuleApi {
  moduleEntryPath: string;
  tsConfig: TsconfigRaw;
  additionalEsbuildPlugins: Array<EsbuildPlugin>;
}

export function bundleModule(api: BundleModuleApi) {
  const { moduleEntryPath, additionalEsbuildPlugins, tsConfig } = api;
  return Esbuild.runBuild({
    platform: "browser",
    format: "iife",
    globalName: "__moduleIifeResult",
    outdir: "out",
    bundle: true,
    write: false,
    minify: true,
    entryPoints: [moduleEntryPath],
    plugins: [
      ...additionalEsbuildPlugins,
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
