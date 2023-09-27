import { esbuildDenoAdapterPlugins } from "../deps/esbuild/deno-adapter-plugin.ts";
import { esbuildSassAdapterPlugins } from "../deps/esbuild/esbuild-sass-plugin.ts";
import { Esbuild, EsbuildPlugin, TsconfigRaw } from "../deps/esbuild/mod.ts";
import { resolvePath } from "../deps/std/path.ts";

export interface BundleAppModuleApi
  extends Pick<
    BundlePreactModuleApi,
    "moduleEntryPath" | "jsBundleBanner" | "cssBundleBanner"
  > {}

export function bundleAppModule(api: BundleAppModuleApi) {
  const { moduleEntryPath, jsBundleBanner, cssBundleBanner } = api;
  return bundlePreactModule({
    iifeResultName: "__appModuleResult",
    moduleEntryPath,
    jsBundleBanner,
    cssBundleBanner,
  });
}

export interface BundleThirdPartyGlobalsModuleApi
  extends Pick<BundlePreactModuleApi, "moduleEntryPath"> {}

export function bundleThirdPartyGlobalsModule(
  api: BundleThirdPartyGlobalsModuleApi
) {
  const { moduleEntryPath } = api;
  return bundlePreactModule({
    iifeResultName: "__thirdPartyGlobalsModuleResult",
    jsBundleBanner: "",
    cssBundleBanner: "",
    moduleEntryPath,
  });
}

export interface BundleStewGlobalsModuleApi
  extends Pick<
    BundlePreactModuleApi,
    "moduleEntryPath" | "jsBundleBanner" | "cssBundleBanner"
  > {}

export function bundleStewGlobalsModule(api: BundleStewGlobalsModuleApi) {
  const { moduleEntryPath, jsBundleBanner, cssBundleBanner } = api;
  return bundlePreactModule({
    iifeResultName: "__stewGlobalsModuleResult",
    moduleEntryPath,
    jsBundleBanner,
    cssBundleBanner,
  });
}

export interface BundleInitialHtmlModuleApi
  extends Pick<BundlePreactModuleApi, "moduleEntryPath"> {}

export function bundleInitialHtmlModule(api: BundleInitialHtmlModuleApi) {
  const { moduleEntryPath } = api;
  return bundlePreactModule({
    iifeResultName: "__initialHtmlModuleResult",
    jsBundleBanner: "",
    cssBundleBanner: "",
    moduleEntryPath,
  });
}

export interface LoadInitialHtmlModuleBundleApi
  extends Pick<LoadModuleBundleApi, "moduleIifeBundleScript"> {}

export function loadInitialHtmlModuleBundle(
  api: LoadInitialHtmlModuleBundleApi
) {
  const { moduleIifeBundleScript } = api;
  return loadModuleBundle({
    iifeResultName: "__initialHtmlModuleResult",
    moduleExportKey: "InitialStewHtml",
    moduleIifeBundleScript,
  });
}

export interface BundleSegmentModuleApi
  extends Pick<BundlePreactModuleApi, "moduleEntryPath"> {}

export function bundleSegmentModule(api: BundleSegmentModuleApi) {
  const { moduleEntryPath } = api;
  return bundlePreactModule({
    iifeResultName: "__segmentModuleResult",
    jsBundleBanner: "",
    cssBundleBanner: "",
    moduleEntryPath,
  });
}

export interface LoadSegmentModuleBundleApi
  extends Pick<LoadModuleBundleApi, "moduleIifeBundleScript"> {}

export function loadSegmentModuleBundle(api: LoadSegmentModuleBundleApi) {
  const { moduleIifeBundleScript } = api;
  return loadModuleBundle({
    iifeResultName: "__segmentModuleResult",
    moduleExportKey: "default",
    moduleIifeBundleScript,
  });
}

interface BundlePreactModuleApi
  extends Pick<
    BundleModuleApi,
    "iifeResultName" | "moduleEntryPath" | "jsBundleBanner" | "cssBundleBanner"
  > {}

async function bundlePreactModule(api: BundlePreactModuleApi) {
  const { moduleEntryPath, iifeResultName, jsBundleBanner, cssBundleBanner } =
    api;
  const bundlePreactModuleResult = await bundleModule({
    moduleEntryPath,
    iifeResultName,
    jsBundleBanner,
    cssBundleBanner,
    additionalEsbuildPlugins: [
      ...esbuildSassAdapterPlugins(),
      {
        name: "esbuild-stew-globals-plugin",
        setup(buildContext) {
          buildContext.onResolve({ filter: /^preact$/ }, () => ({
            namespace: "stew-globals",
            path: "global-preact.js",
          }));
          buildContext.onLoad(
            {
              filter: /^global-preact\.js$/,
              namespace: "stew-globals",
            },
            () => ({
              loader: "js",
              contents: `module.exports = globalThis.Preact`,
            })
          );
          buildContext.onResolve({ filter: /^preact\/hooks$/ }, () => ({
            namespace: "stew-globals",
            path: "global-preact-hooks.js",
          }));
          buildContext.onLoad(
            {
              filter: /^global-preact-hooks\.js$/,
              namespace: "stew-globals",
            },
            () => ({
              loader: "js",
              contents: `module.exports = globalThis.PreactHooks`,
            })
          );
          buildContext.onResolve({ filter: /^stew\/components$/ }, () => ({
            namespace: "stew-globals",
            path: "global-stew-components.js",
          }));
          buildContext.onLoad(
            {
              filter: /^global-stew-components\.js$/,
              namespace: "stew-globals",
            },
            () => ({
              loader: "js",
              contents: `module.exports = globalThis.StewComponents`,
            })
          );
        },
      },
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

export interface BundleConfigModuleApi
  extends Pick<BundleModuleApi, "moduleEntryPath"> {}

export async function bundleConfigModule(api: BundleConfigModuleApi) {
  const { moduleEntryPath } = api;
  const bundleConfigModuleResult = await bundleModule({
    iifeResultName: "__configModuleResult",
    jsBundleBanner: "",
    cssBundleBanner: "",
    tsConfig: {},
    additionalEsbuildPlugins: [],
    moduleEntryPath,
  });
  return bundleConfigModuleResult.outputFiles[0].text;
}

interface LoadConfigModuleBundleApi
  extends Pick<LoadModuleBundleApi, "moduleIifeBundleScript"> {}

export function loadConfigModuleBundle(api: LoadConfigModuleBundleApi) {
  const { moduleIifeBundleScript } = api;
  return loadModuleBundle({
    iifeResultName: "__configModuleResult",
    moduleExportKey: "default",
    moduleIifeBundleScript,
  });
}

interface BundleModuleApi {
  moduleEntryPath: string;
  iifeResultName: string;
  jsBundleBanner: string;
  cssBundleBanner: string;
  tsConfig: TsconfigRaw;
  additionalEsbuildPlugins: Array<EsbuildPlugin>;
}

function bundleModule(api: BundleModuleApi) {
  const {
    iifeResultName,
    moduleEntryPath,
    jsBundleBanner,
    cssBundleBanner,
    additionalEsbuildPlugins,
    tsConfig,
  } = api;
  return Esbuild.runBuild({
    platform: "browser",
    format: "iife",
    outdir: "out",
    bundle: true,
    write: false,
    minify: true,
    globalName: iifeResultName,
    entryPoints: [moduleEntryPath],
    banner: {
      js: jsBundleBanner,
      css: cssBundleBanner,
    },
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

interface LoadModuleBundleApi extends Pick<BundleModuleApi, "iifeResultName"> {
  moduleExportKey: string;
  moduleIifeBundleScript: string;
}

function loadModuleBundle(api: LoadModuleBundleApi) {
  const { moduleIifeBundleScript, iifeResultName, moduleExportKey } = api;
  return new Function(
    `${moduleIifeBundleScript}return ${iifeResultName}["${moduleExportKey}"]`
  )();
}
