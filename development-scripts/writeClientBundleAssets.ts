import {
  bundleAppModule,
  bundleInitialHtmlModule,
  getBundledAssetsLocationMap,
} from "../stew-library/internal/mod.ts";
import { Esbuild } from "../stew-library/deps/esbuild/mod.ts";

await writeClientBundleAssets();
Esbuild.close();

async function writeClientBundleAssets() {
  const [[initialHtmlScript, splashPageCss], [appScript, appCss]] =
    await Promise.all([
      bundleInitialHtmlModule({
        moduleEntryPath: "./stew-client/html/InitialStewHtml.tsx",
      }),
      bundleAppModule({
        moduleEntryPath: "./stew-client/app/main.tsx",
      }),
    ]);
  const bundledAssetClientPathMap = getBundledAssetsLocationMap({
    baseLocation: Deno.cwd(),
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
