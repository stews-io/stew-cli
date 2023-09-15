import { bundlePreactModule } from "../shared/general/bundleModule.ts";
import { Esbuild } from "../shared/deps/esbuild/mod.ts";

writeClientBundleAssets();

async function writeClientBundleAssets() {
  await bundleAndWriteClientHtml();
  await bundleAndWriteClientApp();
  Esbuild.close();
}

async function bundleAndWriteClientHtml() {
  const [initialHtmlIifeBundleScript, splashPageBundleCss] =
    await bundlePreactModule({
      moduleEntryPath: "./source/client/html/InitialStewHtml.tsx",
    });
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/INITIAL_HTML_IIFE_BUNDLE.js",
    initialHtmlIifeBundleScript
  );
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/SPLASH_PAGE_BUNDLE.css",
    splashPageBundleCss
  );
}

async function bundleAndWriteClientApp() {
  const [appIifeBundleScript, appBundleCss] = await bundlePreactModule({
    moduleEntryPath: "./source/client/app/main.tsx",
  });
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/APP_IIFE_BUNDLE.js",
    appIifeBundleScript
  );
  Deno.writeTextFileSync(
    "./source/client/__bundled-assets__/APP_BUNDLE.css",
    appBundleCss
  );
}
