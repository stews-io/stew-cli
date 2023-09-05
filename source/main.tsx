// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */

import { bundle } from "deno/x/emit/mod.ts";
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import { transform as transformEsModuleToIifeModule } from "npm/es-iife";
import { parse as acornParse } from "npm/acorn";
import { renderToString } from "npm/preact-render-to-string";
import { h } from "npm/preact";
import { StewConfig, StewConfigSchema } from "./library/data/StewConfig.ts";

runStewCommand({
  parsedDenoArgs: parseDenoArgs(Deno.args),
});

interface RunStewComandApi {
  parsedDenoArgs: ReturnType<typeof parseDenoArgs>;
}

async function runStewCommand(api: RunStewComandApi) {
  const { parsedDenoArgs } = api;
  const userStewCommand = parsedDenoArgs._[0];
  if (userStewCommand === "build") {
    const maybeStewConfigUrl =
      typeof parsedDenoArgs._[1] === "string"
        ? parsedDenoArgs._[1]
        : throwInvalidErrorPath("parsedDenoArgs._[1]");
    await buildStewApp({
      stewConfigUrl: maybeStewConfigUrl,
    });
  } else {
    throw new Error(`unrecognized command: ${userStewCommand}`);
  }
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
  (window as unknown as any).h = h;
  const maybeStewConfig: unknown = new Function(
    `${stewConfigIifeModule.code}; return stewConfigIifeResult;`
  )();
  const stewConfig: StewConfig = StewConfigSchema.parse(maybeStewConfig);
  console.log(stewConfig);
  // console.log(
  //   renderToString(
  //     <html>
  //       <head></head>
  //       <body>
  //         <curatorStewConfig.ItemDisplay
  //           someItem={{
  //             itemId: 0,
  //             itemFoo: Math.random(),
  //           }}
  //         />
  //       </body>
  //     </html>
  //   )
  // );
}

function throwInvalidErrorPath(errorMessage: string): never {
  throw new Error(`invalid path: ${errorMessage}`);
}
