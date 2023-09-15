import { bundlePreactModule } from "../shared/general/bundleModule.ts";
import { Esbuild } from "../shared/deps/esbuild/mod.ts";
import { getBundledAssetsLocationMap } from "../shared/general/getBundledAssetsLocationMap.ts";

await writeClientBundleAssets();
Esbuild.close();

async function writeClientBundleAssets() {
  const [[initialHtmlScript, splashPageCss], [appScript, appCss]] =
    await Promise.all([
      bundlePreactModule({
        moduleEntryPath: "./source/client/html/InitialStewHtml.tsx",
      }),
      bundlePreactModule({
        moduleEntryPath: "./source/client/app/main.tsx",
      }),
    ]);
  const bundledAssetClientPathMap = getBundledAssetsLocationMap({
    baseLocation: "./source",
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
