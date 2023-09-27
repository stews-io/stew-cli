import {
  bundleAppModule,
  bundleInitialHtmlModule,
  bundleStewGlobalsModule,
  bundleThirdPartyGlobalsModule,
  getBundledAssetsLocationMap,
} from "stew-library/internal";
import { Esbuild } from "../stew-library/deps/esbuild/mod.ts";

await writeClientBundleAssets();
Esbuild.close();

async function writeClientBundleAssets() {
  const [[initialHtmlScript, splashPageCss], [appScript, appCss]] =
    await Promise.all([
      bundleInitialHtmlModule({
        moduleEntryPath: "./stew-command/client/html/InitialStewHtml.tsx",
      }),
      bundleAppModuleWithGlobals(),
    ]);
  const bundledAssetClientPathMap = getBundledAssetsLocationMap({
    baseLocation: "./stew-command",
  });
  Deno.writeTextFileSync(
    bundledAssetClientPathMap.initialHtmlScript,
    initialHtmlScript
  );
  Deno.writeTextFileSync(
    bundledAssetClientPathMap.splashPageCss,
    splashPageCss
  );
  Deno.writeTextFileSync(bundledAssetClientPathMap.appScript, appScript);
  Deno.writeTextFileSync(bundledAssetClientPathMap.appCss, appCss);
}

async function bundleAppModuleWithGlobals() {
  const [thirdPartyGlobalsScript, thirdPartyGlobalsCss] =
    await bundleThirdPartyGlobalsModule({
      moduleEntryPath: "./stew-command/client/app/third-party-globals.ts",
    });
  const [appGlobalsScript, appGlobalsCss] = await bundleStewGlobalsModule({
    moduleEntryPath: "./stew-command/client/app/stew-globals.ts",
    jsBundleBanner: thirdPartyGlobalsScript,
    cssBundleBanner: thirdPartyGlobalsCss,
  });
  return bundleAppModule({
    jsBundleBanner: appGlobalsScript,
    cssBundleBanner: appGlobalsCss,
    moduleEntryPath: "./stew-command/client/app/main.tsx",
  });
}
