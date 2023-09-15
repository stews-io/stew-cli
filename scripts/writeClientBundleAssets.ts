import { bundlePreactModule } from "../shared/general/bundleModule.ts";
import { Esbuild } from "../shared/deps/esbuild/mod.ts";
import { getBundledAssetsClientPathMap } from "../shared/general/getBundledAssetsClientPathMap.ts";

writeClientBundleAssets();

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
  const bundledAssetClientPathMap = getBundledAssetsClientPathMap();
  Deno.writeTextFileSync(
    `./source${bundledAssetClientPathMap.initialHtmlScript}`,
    initialHtmlScript
  );
  Deno.writeTextFileSync(
    `./source${bundledAssetClientPathMap.splashPageCss}`,
    splashPageCss
  );
  Deno.writeTextFileSync(
    `./source${bundledAssetClientPathMap.appScript}`,
    appScript
  );
  Deno.writeTextFileSync(`./source${bundledAssetClientPathMap.appCss}`, appCss);
  Esbuild.close();
}
