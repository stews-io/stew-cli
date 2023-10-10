import { Esbuild } from "../stew-library/deps/esbuild/mod.ts";
import { throwInvalidPathError } from "../stew-library/utilities/mod.ts";
import { buildStewApp } from "./buildStewApp.ts";
import { parseCliArgs } from "./deps/std/flags.ts";
import { setupStewProject } from "./setupStewProject.ts";

try {
  runStewCommand({
    parsedCliArgs: parseCliArgs(Deno.args),
  });
} catch (someStewCommandError) {
  console.error(someStewCommandError);
}

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
      buildDirectoryPath: parsedCliArgs["buildDirectoryPath"] ?? "./build",
    });
    Esbuild.close();
  } else if (userStewCommand === "init") {
    const maybeProjectDirectoryPath =
      typeof parsedCliArgs._[1] === "string" ? parsedCliArgs._[1] : ".";
    await setupStewProject({
      projectDirectoryPath: maybeProjectDirectoryPath,
    });
  } else {
    throw new Error(`unrecognized command: ${userStewCommand}`);
  }
}
