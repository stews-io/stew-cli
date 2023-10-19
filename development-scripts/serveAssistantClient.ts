import { PathToRegexp } from "./deps/path-to-regexp/mod.ts";
import { getContentType } from "./deps/std/media_types.ts";
import { getPathExtension } from "./deps/std/path.ts";

serveAssistantClient({
  buildDirectoryPath: "./__assistant-build",
});

interface ServeAssistantClientApi {
  buildDirectoryPath: string;
}

function serveAssistantClient(api: ServeAssistantClientApi) {
  const { buildDirectoryPath } = api;
  Deno.serve({ port: 8080 }, async (someRequest: Request) => {
    try {
      const unmodifiedRequestPathname = new URL(someRequest.url).pathname;
      console.log(unmodifiedRequestPathname);
      const emptyPathRegexp = PathToRegexp.pathToRegexp("/");
      const rewriteRequestPathnameToIndexHtml = emptyPathRegexp.test(
        unmodifiedRequestPathname
      );
      const filePath = `${buildDirectoryPath}${
        rewriteRequestPathnameToIndexHtml
          ? "/index.html"
          : unmodifiedRequestPathname
      }`;
      console.log(filePath);
      console.log("\n");
      const responseContentLength = (await Deno.stat(filePath)).size;
      const responseContentType =
        getContentType(getPathExtension(filePath)) ??
        "application/octet-stream";
      const responseBody = (await Deno.open(filePath)).readable;
      return new Response(responseBody, {
        headers: {
          "content-length": `${responseContentLength}`,
          "content-type": responseContentType,
        },
      });
    } catch (someError) {
      console.error(someError);
      return someError instanceof Deno.errors.NotFound
        ? new Response(null, { status: 404 })
        : new Response(null, { status: 500 });
    }
  });
}
