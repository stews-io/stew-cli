import { SourceStewConfig } from "../mod.ts";
import {
  BundleModuleApi,
  bundleModule,
  bundlePreactModule,
  loadModuleBundle,
} from "../shared/bundleModule.ts";
import { getRandomCryptoString } from "./deps/crypto-random-string/mod.ts";
import { closeEsbuild } from "./deps/esbuild/mod.ts";
import { FunctionComponent, h as preactH } from "./deps/preact/mod.ts";
import { preactRenderToString } from "./deps/preact/render-to-string.ts";
import { parseDenoArgs } from "./deps/std/flags.ts";
import { getDirectoryPath, joinPaths } from "./deps/std/path.ts";
import { Zod } from "./deps/zod/mod.ts";
import { getStewResourceMap } from "./shared/general/getStewResourceMap.ts";
import { throwInvalidErrorPath } from "./shared/general/throwInvalidPathError.ts";
import {
  SegmentDataset,
  SegmentItem,
  SegmentItemSchema,
} from "./shared/types/SegmentDataset.ts";
import { SegmentModule } from "./shared/types/SegmentModule.ts";
import {
  BuildStewConfig,
  SourceSegmentConfig,
  SourceStewConfigSchema,
} from "./shared/types/StewConfig.ts";

runStewCommand({
  parsedDenoArgs: parseDenoArgs(Deno.args),
});

interface RunStewComandApi {
  parsedDenoArgs: ReturnType<typeof parseDenoArgs>;
}

async function runStewCommand(api: RunStewComandApi) {
  const { parsedDenoArgs } = api;
  const userStewCommand = parsedDenoArgs._[0];
  if (userStewCommand === "build") {
    const maybeStewSourceConfigPath =
      typeof parsedDenoArgs._[1] === "string"
        ? parsedDenoArgs._[1]
        : throwInvalidErrorPath("parsedDenoArgs._[1]");
    await buildStewApp({
      stewSourceConfigPath: maybeStewSourceConfigPath,
      maybeBuildDirectoryPath: parsedDenoArgs["buildDirectoryPath"] ?? null,
    });
    // esbuild needs to be closed for process to terminate
    closeEsbuild();
  } else {
    throw new Error(`unrecognized command: ${userStewCommand}`);
  }
}

interface BuildStewAppApi {
  stewSourceConfigPath: string;
  maybeBuildDirectoryPath: string | null;
}

async function buildStewApp(api: BuildStewAppApi) {
  const { stewSourceConfigPath, maybeBuildDirectoryPath } = api;
  const { stewSourceConfig } = await loadStewSourceConfig({
    stewSourceConfigPath,
  });
  const {
    modulesBuildDirectoryPath,
    stylesBuildDirectoryPath,
    datasetsBuildDirectoryPath,
    stewBuildId,
    buildDirectoryPath,
    configBuildPath,
  } = setupBuildDirectory({
    maybeBuildDirectoryPath,
    stewSourceConfig,
  });
  const stewSourceDirectoryPath = getDirectoryPath(stewSourceConfigPath);
  const loadedSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSegmentSourceConfig of stewSourceConfig.stewSegments) {
    await loadAndWriteSegmentModule({
      modulesBuildDirectoryPath,
      stylesBuildDirectoryPath,
      stewSourceDirectoryPath,
      loadedSegmentModules,
      someSegmentSourceConfig,
    });
    await loadAndWriteSegmentDataset({
      datasetsBuildDirectoryPath,
      someSegmentSourceConfig,
      segmentDatasetPath: joinPaths(
        stewSourceDirectoryPath,
        someSegmentSourceConfig.segmentDatasetPath
      ),
    });
  }
  const stewBuildConfig: BuildStewConfig = {
    stewBuildId,
    stewInfo: stewSourceConfig.stewInfo,
    stewSegments: stewSourceConfig.stewSegments.map(
      (someSourceSegmentConfig) => ({
        segmentKey: someSourceSegmentConfig.segmentKey,
        segmentSearchLabel: someSourceSegmentConfig.segmentSearchLabel,
        segmentViews: someSourceSegmentConfig.segmentViews,
        segmentSortOptions: loadedSegmentModules[
          someSourceSegmentConfig.segmentKey
        ].segmentSortOptions.map((someSegmentSortOption) => ({
          sortOptionKey: someSegmentSortOption.sortOptionKey,
          sortOptionLabel: someSegmentSortOption.sortOptionLabel,
        })),
      })
    ),
  };
  const {
    initialHtmlIifeBundleScript,
    splashPageBundleCss,
    appIifeBundleScript,
    appBundleCss,
  } = await fetchBundledAssets();
  writeCoreBuildFiles({
    buildDirectoryPath,
    configBuildPath,
    stewBuildConfig,
    initialHtmlIifeBundleScript,
    splashPageBundleCss,
    appIifeBundleScript,
    appBundleCss,
  });
}

interface LoadStewSourceConfigApi
  extends Pick<BuildStewAppApi, "stewSourceConfigPath"> {}

interface LoadStewSourceConfigResult {
  stewSourceConfig: SourceStewConfig;
}

async function loadStewSourceConfig(
  api: LoadStewSourceConfigApi
): Promise<LoadStewSourceConfigResult> {
  const { stewSourceConfigPath } = api;
  const [stewSourceConfig] = await loadBasicModule({
    moduleEntryPath: stewSourceConfigPath,
    ModuleResultSchema: SourceStewConfigSchema(),
  });
  return {
    stewSourceConfig,
  };
}

interface SetupBuildDirectoryApi
  extends Pick<BuildStewAppApi, "maybeBuildDirectoryPath">,
    Pick<LoadStewSourceConfigResult, "stewSourceConfig"> {}

function setupBuildDirectory(api: SetupBuildDirectoryApi) {
  const { maybeBuildDirectoryPath, stewSourceConfig } = api;
  const buildDirectoryPath =
    maybeBuildDirectoryPath ?? `./build_${stewSourceConfig.stewInfo.stewName}`;
  const stewBuildId = getRandomCryptoString({
    length: 6,
    type: "alphanumeric",
  });
  const stewResourceMap = getStewResourceMap({
    stewBuildId,
  });
  const stewResourcesBuildDirectoryPath = `${buildDirectoryPath}${stewResourceMap.stewResourcesDirectoryPath}`;
  const configBuildPath = `${buildDirectoryPath}${stewResourceMap.configPath}`;
  const modulesBuildDirectoryPath = `${buildDirectoryPath}${stewResourceMap.modulesDirectoryPath}`;
  const datasetsBuildDirectoryPath = `${buildDirectoryPath}${stewResourceMap.datasetsDirectoryPath}`;
  const stylesBuildDirectoryPath = `${buildDirectoryPath}${stewResourceMap.stylesDirectoryPath}`;
  Deno.mkdirSync(stewResourcesBuildDirectoryPath, { recursive: true });
  Deno.mkdirSync(modulesBuildDirectoryPath);
  Deno.mkdirSync(datasetsBuildDirectoryPath);
  Deno.mkdirSync(stylesBuildDirectoryPath);
  return {
    stewBuildId,
    buildDirectoryPath,
    stewResourcesBuildDirectoryPath,
    configBuildPath,
    modulesBuildDirectoryPath,
    datasetsBuildDirectoryPath,
    stylesBuildDirectoryPath,
  };
}

interface LoadAndWriteSegmentModuleApi
  extends Pick<
    ReturnType<typeof setupBuildDirectory>,
    "modulesBuildDirectoryPath" | "stylesBuildDirectoryPath"
  > {
  stewSourceDirectoryPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
  loadedSegmentModules: Record<string, SegmentModule<SegmentItem>>;
}

async function loadAndWriteSegmentModule(api: LoadAndWriteSegmentModuleApi) {
  const {
    stewSourceDirectoryPath,
    loadedSegmentModules,
    someSegmentSourceConfig,
    stylesBuildDirectoryPath,
    modulesBuildDirectoryPath,
  } = api;
  const [segmentModuleIifeScript, segmentModuleCss] = await bundlePreactModule({
    moduleEntryPath: joinPaths(
      stewSourceDirectoryPath,
      someSegmentSourceConfig.segmentModulePath
    ),
  });
  const segmentModule = loadModuleBundle({
    moduleExportKey: "default",
    moduleIifeBundleScript: segmentModuleIifeScript,
  });
  loadedSegmentModules[someSegmentSourceConfig.segmentKey] = segmentModule;
  await Deno.writeTextFile(
    `${modulesBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.js`,
    segmentModuleIifeScript
  );
  await Deno.writeTextFile(
    `${stylesBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.css`,
    segmentModuleCss
  );
}

interface LoadAndWriteSegmentDatasetApi
  extends Pick<
    ReturnType<typeof setupBuildDirectory>,
    "datasetsBuildDirectoryPath"
  > {
  segmentDatasetPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
}

async function loadAndWriteSegmentDataset(api: LoadAndWriteSegmentDatasetApi) {
  const {
    segmentDatasetPath,
    someSegmentSourceConfig,
    datasetsBuildDirectoryPath,
  } = api;
  const [segmentDataset] = await loadBasicModule<SegmentDataset<SegmentItem>>({
    ModuleResultSchema: Zod.array(SegmentItemSchema()),
    moduleEntryPath: segmentDatasetPath,
  });
  await Deno.writeTextFile(
    `${datasetsBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.json`,
    JSON.stringify(segmentDataset)
  );
}

interface FetchBundledAssetsResult {
  appIifeBundleScript: string;
  appBundleCss: string;
  initialHtmlIifeBundleScript: string;
  splashPageBundleCss: string;
}

async function fetchBundledAssets(): Promise<FetchBundledAssetsResult> {
  const scriptBaseDirectoryUrl = getDirectoryPath(import.meta.url);
  const bundleAssetsDirectoryUrl = `${scriptBaseDirectoryUrl}/client/__bundled-assets__`;
  const [
    appIifeBundleScript,
    appBundleCss,
    initialHtmlIifeBundleScript,
    splashPageBundleCss,
  ] = await Promise.all([
    fetchBundleAsset({
      bundleAssetsDirectoryUrl,
      assetFilename: "APP_IIFE_BUNDLE.js",
    }),
    fetchBundleAsset({
      bundleAssetsDirectoryUrl,
      assetFilename: "APP_BUNDLE.css",
    }),
    fetchBundleAsset({
      bundleAssetsDirectoryUrl,
      assetFilename: "INITIAL_HTML_IIFE_BUNDLE.js",
    }),
    fetchBundleAsset({
      bundleAssetsDirectoryUrl,
      assetFilename: "SPLASH_PAGE_BUNDLE.css",
    }),
  ]);
  return {
    appIifeBundleScript,
    appBundleCss,
    initialHtmlIifeBundleScript,
    splashPageBundleCss,
  };
}

interface FetchBundleAssetApi {
  bundleAssetsDirectoryUrl: string;
  assetFilename: string;
}

function fetchBundleAsset(api: FetchBundleAssetApi) {
  const { bundleAssetsDirectoryUrl, assetFilename } = api;
  return fetch(`${bundleAssetsDirectoryUrl}/${assetFilename}`).then(
    (fetchBundleAssetResponse) => fetchBundleAssetResponse.text()
  );
}

interface WriteCoreBuildFilesApi
  extends Pick<
      ReturnType<typeof setupBuildDirectory>,
      "buildDirectoryPath" | "configBuildPath"
    >,
    Pick<
      FetchBundledAssetsResult,
      | "appIifeBundleScript"
      | "appBundleCss"
      | "initialHtmlIifeBundleScript"
      | "splashPageBundleCss"
    > {
  stewBuildConfig: BuildStewConfig;
}

function writeCoreBuildFiles(api: WriteCoreBuildFilesApi) {
  const {
    configBuildPath,
    stewBuildConfig,
    buildDirectoryPath,
    initialHtmlIifeBundleScript,
    splashPageBundleCss,
    appIifeBundleScript,
    appBundleCss,
  } = api;
  Deno.writeTextFileSync(configBuildPath, JSON.stringify(stewBuildConfig));
  (window as any).h = preactH;
  const initialStewHtmlComponent: FunctionComponent<any> = loadModuleBundle({
    moduleExportKey: "InitialStewHtml",
    moduleIifeBundleScript: initialHtmlIifeBundleScript,
  });
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/index.html`,
    `<!DOCTYPE html>${preactRenderToString(
      preactH(initialStewHtmlComponent, {
        stewBuildConfig,
        splashPageBundleCss,
      })
    )}`
  );
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/app.${stewBuildConfig.stewBuildId}.js`,
    appIifeBundleScript
  );
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/app.${stewBuildConfig.stewBuildId}.css`,
    appBundleCss
  );
}

interface LoadBasicModuleApi<ModuleResult>
  extends Pick<BundleModuleApi, "moduleEntryPath"> {
  ModuleResultSchema: Zod.ZodType<ModuleResult, Zod.ZodTypeDef, unknown>;
}

async function loadBasicModule<ModuleResult>(
  api: LoadBasicModuleApi<ModuleResult>
): Promise<[ModuleResult, string]> {
  const { moduleEntryPath, ModuleResultSchema } = api;
  const buildBundleResult = await bundleModule({
    moduleEntryPath,
    minifyBundle: true,
    tsConfig: {},
  });
  const iifeBundleScript = buildBundleResult.outputFiles[0].text;
  const iifeResult: unknown = loadModuleBundle({
    moduleExportKey: "default",
    moduleIifeBundleScript: iifeBundleScript,
  });
  return [ModuleResultSchema.parse(iifeResult), iifeBundleScript];
}
