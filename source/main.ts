import { bundle } from "deno/x/emit/mod.ts";
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import { transform as transformEsModuleToIifeModule } from "https://esm.sh/es-iife@0.2.0";
import { parse as acornParse } from "npm/acorn";

const parsedDenoArgs = parseDenoArgs(Deno.args, {});
const stewCommand = parsedDenoArgs._[0];

if (stewCommand === "build" && typeof parsedDenoArgs._[1] === "string") {
  const maybeStewConfigUrl = parsedDenoArgs._[1];
  buildStewApp({
    stewConfigUrl: maybeStewConfigUrl,
  });
} else {
  throw new Error(`oops, sumthing happened!`);
}

interface BuildStewAppApi {
  stewConfigUrl: string;
}

async function buildStewApp(api: BuildStewAppApi) {
  const { stewConfigUrl } = api;
  const stewConfigBundle = await bundle(stewConfigUrl);
  const stewConfigIifeModule = transformEsModuleToIifeModule({
    code: stewConfigBundle.code,
    name: "stewConfigIifeResult",
    parse: (code: string) =>
      acornParse(code, {
        sourceType: "module",
        ecmaVersion: 2020,
      }),
  });
  const maybeStewConfig: unknown = new Function(
    `${stewConfigIifeModule.code}; return stewConfigIifeResult;`
  )();
  console.log(maybeStewConfig);
}
