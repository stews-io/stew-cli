import {
  build as buildBundle,
  stop as closeEsbuild,
  Plugin,
} from "deno/x/esbuild/mod.js";
import { denoPlugins } from "deno/x/esbuild_deno_loader/mod.ts";
import { resolve } from "deno/std/path/mod.ts";

compileCli();

async function compileCli() {
  // await bundleAndWriteClientHtml();
  await bundleAndWriteClientApp();
  closeEsbuild();
  // await new Deno.Command(Deno.execPath(), {
  //   args: ["compile", "--allow-all", "--output=./stew", "./source/main.tsx"],
  //   stdout: "piped",
  //   stderr: "piped",
  // }).output();
}

async function bundleAndWriteClientHtml() {
  const bundleClientResult = await buildBundle({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    entryPoints: ["./source/client/html/InitialStewHtml.tsx"],
    plugins: [
      ...(denoPlugins({
        loader: "native",
        configPath: resolve(`${Deno.cwd()}/deno.json`),
      }) as Array<Plugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  Deno.writeTextFileSync(
    "./source/client/html/HTML_BUNDLE.js",
    `export const HTML_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
  );
}

async function bundleAndWriteClientApp() {
  const bundleClientResult = await buildBundle({
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    format: "iife",
    entryPoints: ["./source/client/app/main.tsx"],
    plugins: [
      ...(denoPlugins({
        loader: "native",
        configPath: resolve(`${Deno.cwd()}/deno.json`),
      }) as Array<Plugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  Deno.writeTextFileSync(
    "./source/client/app/APP_BUNDLE_JS.ts",
    `export const APP_BUNDLE_JS = "${bundleClientResult.outputFiles[0].text
      .replaceAll('"', '\\"')
      .trimEnd()}"`
  );
}
