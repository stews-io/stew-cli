import { FunctionComponent, createElement } from "../deps/preact/mod.ts";
import { preactRenderToString } from "../deps/preact/render-to-string.ts";
import { loadModuleBundle } from "./loadModuleBundle.ts";

export interface FetchAndWriteClientBundlesApi {
  htmlComponentName: string;
  htmlComponentProps: Record<string, unknown>;
  clientBundles: {
    appScript: string;
    appCss: string;
    htmlScript: string;
    splashPageCss: string;
  };
  outputDirectoryMap: {
    indexHtml: string;
    appScript: string;
    appCss: string;
  };
}

export async function writeClientBundles(api: FetchAndWriteClientBundlesApi) {
  const {
    outputDirectoryMap,
    clientBundles,
    htmlComponentName,
    htmlComponentProps,
  } = api;
  Deno.writeTextFileSync(outputDirectoryMap.appScript, clientBundles.appScript);
  Deno.writeTextFileSync(outputDirectoryMap.appCss, clientBundles.appCss);
  const clientHtmlComponent: FunctionComponent<Record<string, unknown>> =
    loadModuleBundle({
      moduleExportKey: htmlComponentName,
      moduleIifeBundleScript: clientBundles.htmlScript,
    });
  Object.assign(globalThis, {
    h: createElement,
  });
  Deno.writeTextFileSync(
    outputDirectoryMap.indexHtml,
    `<!DOCTYPE html>${preactRenderToString(
      createElement(clientHtmlComponent, {
        splashPageCss: clientBundles.splashPageCss,
        ...htmlComponentProps,
      })
    )}`
  );
}
