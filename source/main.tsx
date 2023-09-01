/** @jsxImportSource npm/preact */
import { bundle } from "deno/x/emit/mod.ts";
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import { transform as transformEsModuleToIifeModule } from "npm/es-iife";
import { parse as acornParse } from "npm/acorn";
import { CuratorStewConfig, CuratorStewConfigSchema } from "./StewConfig.ts";
import { renderToString } from "npm/preact-render-to-string";
import { h as h_preact } from "npm/preact";

const parsedDenoArgs = parseDenoArgs(Deno.args, {});
const stewCommand = parsedDenoArgs._[0];

if (stewCommand === "build") {
  const maybeStewConfigUrl =
    typeof parsedDenoArgs._[1] === "string"
      ? parsedDenoArgs._[1]
      : throwInvalidErrorPath("parsedDenoArgs._[1]");
  await buildStewApp({
    stewConfigUrl: maybeStewConfigUrl,
  });
} else {
  throw new Error(`unrecognized command: ${stewCommand}`);
}

interface BuildStewAppApi {
  stewConfigUrl: string;
}

async function buildStewApp(api: BuildStewAppApi) {
  const { stewConfigUrl } = api;
  const stewConfigBundle = await bundle(stewConfigUrl, {
    compilerOptions: {
      jsxFactory: "h",
      jsxFragmentFactory: "Fragment",
    },
  });
  const stewConfigIifeModule = transformEsModuleToIifeModule({
    code: stewConfigBundle.code,
    name: "stewConfigIifeResult",
    parse: (code: string) =>
      acornParse(code, {
        sourceType: "module",
        ecmaVersion: 2020,
      }),
  });
  // mount preact jsx factory onto window so iife evaluation works
  // deno-lint-ignore no-explicit-any
  (window as unknown as any).h = h_preact;
  const maybeStewConfig: unknown = new Function(
    `${stewConfigIifeModule.code}; return stewConfigIifeResult;`
  )();
  const curatorStewConfig: CuratorStewConfig =
    CuratorStewConfigSchema.parse(maybeStewConfig);
  console.log(
    renderToString(
      <curatorStewConfig.ItemDisplay someRandomNumber={Math.random()} />
    )
  );
}

function throwInvalidErrorPath(errorMessage: string): never {
  throw new Error(`invalid path: ${errorMessage}`);
}
