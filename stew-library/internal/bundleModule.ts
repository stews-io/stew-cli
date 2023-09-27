import { esbuildDenoAdapterPlugins } from "../deps/esbuild/deno-adapter-plugin.ts";
import { esbuildSassAdapterPlugins } from "../deps/esbuild/esbuild-sass-plugin.ts";
import { Esbuild, EsbuildPlugin, TsconfigRaw } from "../deps/esbuild/mod.ts";
import { resolvePath } from "../deps/std/path.ts";

export interface BundleSegmentModuleApi
  extends Pick<BundlePreactModuleApi, "moduleEntryPath"> {}

export function bundleSegmentModule(api: BundleSegmentModuleApi) {
  const { moduleEntryPath } = api;
  return bundlePreactModule({
    moduleEntryPath,
    additionalEsbuildPlugins: [
      esbuildStewGlobalsPlugin({
        globalImportsMap: {
          preact: {
            importNameRegex: /^preact$/,
            globalExport: "globalThis.Preact",
          },
          "preact/hooks": {
            importNameRegex: /^preact\/hooks$/,
            globalExport: "globalThis.PreactHooks",
          },
          "stew/components": {
            importNameRegex: /^stew\/components$/,
            globalExport: "globalThis.StewComponents",
          },
          "stew/hooks": {
            importNameRegex: /^stew\/hooks$/,
            globalExport: "globalThis.StewHooks",
          },
        },
      }),
    ],
  });
}

export interface BundleAppModuleApi
  extends Pick<BundlePreactModuleApi, "moduleEntryPath"> {}

export function bundleAppModule(api: BundleAppModuleApi) {
  const { moduleEntryPath } = api;
  return bundlePreactModule({
    moduleEntryPath,
    additionalEsbuildPlugins: [
      esbuildStewGlobalsPlugin({
        globalImportsMap: {
          zod: {
            importNameRegex: /^https:\/\/deno\.land\/x\/zod/,
            globalExport: "{}",
          },
        },
      }),
    ],
  });
}

export interface BundleInitialHtmlModuleApi
  extends Pick<BundlePreactModuleApi, "moduleEntryPath"> {}

export function bundleInitialHtmlModule(api: BundleInitialHtmlModuleApi) {
  const { moduleEntryPath } = api;
  return bundlePreactModule({
    moduleEntryPath,
    additionalEsbuildPlugins: [],
  });
}

interface BundlePreactModuleApi
  extends Pick<
    BundleModuleApi,
    "moduleEntryPath" | "additionalEsbuildPlugins"
  > {}

async function bundlePreactModule(api: BundlePreactModuleApi) {
  const { moduleEntryPath, additionalEsbuildPlugins } = api;
  const bundlePreactModuleResult = await bundleModule({
    moduleEntryPath,
    additionalEsbuildPlugins: [
      ...esbuildSassAdapterPlugins(),
      ...additionalEsbuildPlugins,
    ],
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

interface EsbuildStewGlobalsPluginApi {
  globalImportsMap: Record<
    string,
    {
      importNameRegex: RegExp;
      globalExport: string;
    }
  >;
}

function esbuildStewGlobalsPlugin(api: EsbuildStewGlobalsPluginApi) {
  const { globalImportsMap } = api;
  return {
    name: "esbuild-stew-globals-plugin",
    setup(buildContext) {
      Object.entries(globalImportsMap).forEach(
        ([someGlobalImportConfigKey, someGlobalImportConfig]) => {
          const globalModuleFileName = `${someGlobalImportConfigKey}.global.js`;
          buildContext.onResolve(
            { filter: someGlobalImportConfig.importNameRegex },
            () => ({
              namespace: "stew-globals",
              path: globalModuleFileName,
            })
          );
          buildContext.onLoad(
            {
              filter: new RegExp(globalModuleFileName),
              namespace: "stew-globals",
            },
            () => ({
              loader: "js",
              contents: `module.exports = ${someGlobalImportConfig.globalExport}`,
            })
          );
        }
      );
    },
  };
}

export interface BundleConfigModuleApi
  extends Pick<BundleModuleApi, "moduleEntryPath"> {}

export async function bundleConfigModule(api: BundleConfigModuleApi) {
  const { moduleEntryPath } = api;
  const bundleConfigModuleResult = await bundleModule({
    tsConfig: {},
    additionalEsbuildPlugins: [],
    moduleEntryPath,
  });
  return bundleConfigModuleResult.outputFiles[0].text;
}

interface BundleModuleApi {
  moduleEntryPath: string;
  tsConfig: TsconfigRaw;
  additionalEsbuildPlugins: Array<EsbuildPlugin>;
}

function bundleModule(api: BundleModuleApi) {
  const { moduleEntryPath, additionalEsbuildPlugins, tsConfig } = api;
  return Esbuild.runBuild({
    platform: "browser",
    format: "iife",
    globalName: "__moduleBundleIifeResult",
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
