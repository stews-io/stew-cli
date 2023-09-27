import { throwInvalidPathError } from "stew/utilities";
import { Esbuild } from "../stew-library/deps/esbuild/mod.ts";
import { buildStewApp } from "./buildStewApp.ts";
import { parseCliArgs } from "./deps/std/flags.ts";

runStewCommand({
  parsedCliArgs: parseCliArgs(Deno.args),
});

interface RunStewComandApi {
  parsedCliArgs: ReturnType<typeof parseCliArgs>;
}

async function runStewCommand(api: RunStewComandApi) {
  const { parsedCliArgs } = api;
  const userStewCommand = parsedCliArgs._[0];
  if (userStewCommand === "build") {
    const maybeStewSourceConfigPath =
      typeof parsedCliArgs._[1] === "string"
        ? parsedCliArgs._[1]
        : throwInvalidPathError("parsedCliArgs._[1]");
    await buildStewApp({
      stewSourceConfigPath: maybeStewSourceConfigPath,
      maybeBuildDirectoryPath: parsedCliArgs["buildDirectoryPath"] ?? null,
    });
    Esbuild.close();
  } else {
    throw new Error(`unrecognized command: ${userStewCommand}`);
  }
}
