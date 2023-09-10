import {
  build as buildBundle,
  stop as closeEsbuild,
} from "deno/x/esbuild/mod.js";
import { denoPlugins } from "deno/x/esbuild_deno_loader/mod.ts";
import { resolve } from "deno/std/path/mod.ts";

await bundleClientApp();

async function bundleClientApp() {
  const bundleClientResult = await buildBundle({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    entryPoints: ["./source/client/app/main.tsx"],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
    plugins: [
      ...(denoPlugins({
        loader: "native",
        configPath: resolve(`${Deno.cwd()}/deno.json`),
      }) as unknown as any),
    ],
  });
  closeEsbuild();
  Deno.writeTextFileSync(
    "./source/client/app/APP_BUNDLE_JS.ts",
    `export const APP_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
  );
}
