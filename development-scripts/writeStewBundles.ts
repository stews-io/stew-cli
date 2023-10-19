import {
  bundleAppModule,
  bundleHtmlModule,
  getStewBundlesLocationMap,
} from "../stew-library/internal/mod.ts";
import { Esbuild } from "../stew-library/deps/esbuild/mod.ts";

await writeClientBundleAssets();
Esbuild.close();

async function writeClientBundleAssets() {
  const [[stewHtmlScript, splashPageCss], [appScript, appCss]] =
    await Promise.all([
      bundleHtmlModule({
        moduleEntryPath: "./stew-client/StewHtml.tsx",
      }),
      bundleAppModule({
        moduleEntryPath: "./stew-client/main.ts",
      }),
    ]);
  const stewBundlesLocationMap = getStewBundlesLocationMap({
    baseLocation: Deno.cwd(),
  });
  Deno.writeTextFileSync(stewBundlesLocationMap.stewHtmlScript, stewHtmlScript);
  Deno.writeTextFileSync(stewBundlesLocationMap.splashPageCss, splashPageCss);
  Deno.writeTextFileSync(stewBundlesLocationMap.appScript, appScript);
  Deno.writeTextFileSync(stewBundlesLocationMap.appCss, appCss);
}
