import { esbuildDenoAdapterPlugins } from "../shared/deps/esbuild/deno-adapter-plugin.ts";
import { esbuildSassAdapterPlugins } from "../shared/deps/esbuild/esbuild-sass-plugin.ts";
import { Esbuild, EsbuildPlugin } from "../shared/deps/esbuild/mod.ts";
import { resolvePath } from "../shared/deps/std/path.ts";
import * as PreactHooks from "../shared/deps/preact/hooks.ts";

await writeLibraryPackageBundle();
Esbuild.close();

async function writeLibraryPackageBundle() {
  const libraryPackageBundleResult = await Esbuild.runBuild({
    platform: "browser",
    format: "iife",
    globalName: "__moduleIifeResult",
    outdir: "out",
    bundle: true,
    write: false,
    minify: true,
    entryPoints: ["./mod.ts"],
    plugins: [
      ...esbuildSassAdapterPlugins({
        type: "style",
      }),
      {
        name: "global-preact-hooks-plugin",
        setup(buildContext) {
          const globalHookModuleDeclarations = Object.keys(PreactHooks)
            .map(
              (somePreactHookKey) =>
                `const ${somePreactHookKey} = (...args) => globalThis.PreactHooks.${somePreactHookKey}(...args)`
            )
            .join("\n");
          const globalHookModuleExports = Object.keys(PreactHooks).join(",");
          const globalHookModuleScript = `${globalHookModuleDeclarations}\nexport {${globalHookModuleExports}}`;
          buildContext.onResolve({ filter: /^preact\/hooks$/ }, () => ({
            namespace: "global-preact-hooks",
            path: "global-preact-hooks.js",
          }));
          buildContext.onLoad(
            {
              filter: /^global-preact-hooks\.js$/,
              namespace: "global-preact-hooks",
            },
            () => ({
              loader: "js",
              contents: globalHookModuleScript,
            })
          );
        },
      },
      ...(esbuildDenoAdapterPlugins({
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
    "./mod.js",
    libraryPackageBundleResult.outputFiles[0].text
  );
}
