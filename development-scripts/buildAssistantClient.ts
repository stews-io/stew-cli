import { Esbuild } from "../stew-library/deps/esbuild/mod.ts";
import {
  bundleAppModule,
  bundleHtmlModule,
  createBuildId,
  writeClientBundles,
} from "../stew-library/internal/mod.ts";

buildAssistantClient({
  buildDirectoryPath: "./__assistant-build",
});

interface BuildAssistantClientApi {
  buildDirectoryPath: string;
}

async function buildAssistantClient(api: BuildAssistantClientApi) {
  const { buildDirectoryPath } = api;
  const assistantBuildId = createBuildId();
  await Deno.mkdir(buildDirectoryPath, {
    recursive: true,
  });
  const [
    [assistantHtmlScript, assistantSplashPageCss],
    [assistantAppScript, assistantAppCss],
  ] = await Promise.all([
    bundleHtmlModule({
      moduleEntryPath: "./stew-assistant/client/AssistantHtml.tsx",
    }),
    bundleAppModule({
      moduleEntryPath: "./stew-assistant/client/main.ts",
      globalImportsMap: {},
    }),
  ]);
  await writeClientBundles({
    htmlComponentName: "AssistantHtml",
    htmlComponentProps: {
      buildId: assistantBuildId,
    },
    clientBundles: {
      htmlScript: assistantHtmlScript,
      splashPageCss: assistantSplashPageCss,
      appScript: assistantAppScript,
      appCss: assistantAppCss,
    },
    outputDirectoryMap: {
      indexHtml: `${buildDirectoryPath}/index.html`,
      appScript: `${buildDirectoryPath}/app.${assistantBuildId}.js`,
      appCss: `${buildDirectoryPath}/app.${assistantBuildId}.css`,
    },
  });
  Esbuild.close();
}
