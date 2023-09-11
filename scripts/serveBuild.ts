import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";
import { extname } from "deno/std/path/mod.ts";

const buildDirectoryPath = parseDenoArgs(Deno.args)._[0];

Deno.serve({ port: 8080 }, handleRequest);

async function handleRequest(someRequest: Request) {
  try {
    const filePath = `${buildDirectoryPath}${
      new URL(someRequest.url).pathname
    }`;
    const responseContentLength = (await Deno.stat(filePath)).size;
    const responseContentType =
      contentType(extname(filePath)) ?? "application/octet-stream";
    const responseBody = (await Deno.open(filePath)).readable;
    console.log(filePath);
    console.log(responseContentLength);
    console.log(responseContentType);
    console.log(responseBody);
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
