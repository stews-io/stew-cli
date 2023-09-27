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
    // externalModules: ["preact", "preact/hooks", "stew/components"],
    additionalEsbuildPlugins: [
      ...esbuildSassAdapterPlugins(),
      {
        name: "esbuild-stew-globals-plugin",
        setup(buildContext) {
          // const globalHookModuleDeclarations = Object.keys(PreactHooks)
          //   .map(
          //     (somePreactHookKey) =>
          //       `const ${somePreactHookKey} = (...args) => globalThis.PreactHooks.${somePreactHookKey}(...args)`
          //   )
          //   .join("\n");
          // const globalHookModuleExports = Object.keys(PreactHooks).join(",");
          // const globalHookModuleScript = `${globalHookModuleDeclarations}\nexport {${globalHookModuleExports}}`;
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
              contents: `module.exports = Preact`,
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
              contents: `module.exports = PreactHooks`,
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
              contents: `module.exports = StewComponents`,
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

export interface BundleModuleApi {
  moduleEntryPath: string;
  tsConfig: TsconfigRaw;
  additionalEsbuildPlugins: Array<EsbuildPlugin>;
  // externalModules: Array<string>;
}

export function bundleModule(api: BundleModuleApi) {
  const {
    // externalModules,
    moduleEntryPath,
    additionalEsbuildPlugins,
    tsConfig,
  } = api;
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
