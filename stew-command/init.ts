import { parseCliArgs } from "https://raw.githubusercontent.com/stews-io/toolkit/production/stew-command/deps/std/flags.ts";
import { setupStewProject } from "https://raw.githubusercontent.com/stews-io/toolkit/production/stew-command/setupStewProject.ts";

try {
  const parsedCliArgs = parseCliArgs(Deno.args);
  const maybeProjectDirectoryPath =
    typeof parsedCliArgs._[0] === "string" ? parsedCliArgs._[0] : ".";
  setupStewProject({
    projectDirectoryPath: maybeProjectDirectoryPath,
  });
} catch (someStewCommandError) {
  console.error(someStewCommandError);
}
