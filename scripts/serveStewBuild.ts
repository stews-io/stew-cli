import { parseDenoArgs } from "./deps/std/flags.ts";
import { getContentType } from "./deps/std/media_types.ts";
import { getPathExtension } from "./deps/std/path.ts";

const buildDirectoryPath = parseDenoArgs(Deno.args)._[0];

Deno.serve({ port: 8080 }, handleRequest);

async function handleRequest(someRequest: Request) {
  try {
    const filePath = `${buildDirectoryPath}${
      new URL(someRequest.url).pathname
    }`;
    const responseContentLength = (await Deno.stat(filePath)).size;
    const responseContentType =
      getContentType(getPathExtension(filePath)) ?? "application/octet-stream";
    const responseBody = (await Deno.open(filePath)).readable;
    console.log(filePath);
    console.log(responseContentLength);
    console.log(responseContentType);
    console.log(responseBody);
    console.log("\n");
    return new Response(responseBody, {
      headers: {
        "content-length": `${responseContentLength}`,
        "content-type": responseContentType,
      },
    });
  } catch (someError) {
    return someError instanceof Deno.errors.NotFound
      ? new Response(null, { status: 404 })
      : new Response(null, { status: 500 });
  }
}
