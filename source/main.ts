import { Esbuild } from "../shared/deps/esbuild/mod.ts";
import { FunctionComponent, h as preactH } from "../shared/deps/preact/mod.ts";
import { Zod } from "../shared/deps/zod/mod.ts";
import {
  BundleModuleApi,
  bundleModule,
  bundlePreactModule,
  loadModuleBundle,
} from "../shared/general/bundleModule.ts";
import { getBundledAssetsLocationMap } from "../shared/general/getBundledAssetsLocationMap.ts";
import { throwInvalidPathError } from "../shared/general/throwInvalidPathError.ts";
import {
  SegmentDataset,
  SegmentItem,
  SegmentItemSchema,
} from "../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../shared/types/SegmentModule.ts";
import { SegmentViewsMap } from "../shared/types/SegmentViewsMap.ts";
import {
  BuildStewConfig,
  SourceSegmentConfig,
  SourceStewConfig,
  SourceStewConfigSchema,
} from "../shared/types/StewConfig.ts";
import { getRandomCryptoString } from "./deps/crypto-random-string/mod.ts";
import { preactRenderToString } from "./deps/preact/render-to-string.ts";
import { parseDenoArgs } from "./deps/std/flags.ts";
import { getDirectoryPath, joinPaths } from "./deps/std/path.ts";
import { getStewResourceMap } from "./shared/general/getStewResourceMap.ts";
import { StewResourceMap } from "./shared/types/StewResourceMap.ts";

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
        : throwInvalidPathError("parsedDenoArgs._[1]");
    await buildStewApp({
      stewSourceConfigPath: maybeStewSourceConfigPath,
      maybeBuildDirectoryPath: parsedDenoArgs["buildDirectoryPath"] ?? null,
    });
    Esbuild.close();
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
  const { buildDirectoryMap, stewBuildId } = setupBuildDirectories({
    maybeBuildDirectoryPath,
    stewSourceConfig,
  });
  const stewSourceDirectoryPath = getDirectoryPath(stewSourceConfigPath);
  const loadedSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSegmentSourceConfig of stewSourceConfig.stewSegments) {
    await Promise.all([
      writeSegmentViews({
        buildDirectoryMap,
        someSegmentSourceConfig,
      }),
      loadAndWriteSegmentModule({
        buildDirectoryMap,
        stewSourceDirectoryPath,
        loadedSegmentModules,
        someSegmentSourceConfig,
      }),
      loadAndWriteSegmentDataset({
        buildDirectoryMap,
        someSegmentSourceConfig,
        segmentDatasetPath: joinPaths(
          stewSourceDirectoryPath,
          someSegmentSourceConfig.segmentDatasetPath
        ),
      }),
    ]);
  }
  const { stewBuildConfig } = getStewBuildConfig({
    stewSourceConfig,
    stewBuildId,
    loadedSegmentModules,
  });
  await fetchBundledAssetsAndWriteCoreBuildFiles({
    buildDirectoryMap,
    stewBuildConfig,
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
  const [stewSourceConfig] = await loadBasicModule<SourceStewConfig>({
    moduleEntryPath: stewSourceConfigPath,
    ModuleResultSchema: SourceStewConfigSchema(),
  });
  return {
    stewSourceConfig,
  };
}

interface SetupBuildDirectoriesApi
  extends Pick<BuildStewAppApi, "maybeBuildDirectoryPath">,
    Pick<LoadStewSourceConfigResult, "stewSourceConfig"> {}

type BuildDirectoryMap = {
  [SomeStewResourceKey in keyof StewResourceMap]: `${string}/${StewResourceMap[SomeStewResourceKey]}`;
};

function setupBuildDirectories(api: SetupBuildDirectoriesApi) {
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
  const buildDirectoryMap = Object.keys(stewResourceMap).reduce<
    Record<string, string>
  >((buildDirectoryMapResult, someStewResourceKey) => {
    buildDirectoryMapResult[someStewResourceKey] = `${buildDirectoryPath}${
      stewResourceMap[someStewResourceKey as keyof StewResourceMap]
    }`;
    return buildDirectoryMapResult;
  }, {}) as BuildDirectoryMap;
  Deno.mkdirSync(buildDirectoryMap.stewResourcesDirectoryPath, {
    recursive: true,
  });
  Deno.mkdirSync(buildDirectoryMap.datasetsDirectoryPath);
  Deno.mkdirSync(buildDirectoryMap.modulesDirectoryPath);
  Deno.mkdirSync(buildDirectoryMap.stylesDirectoryPath);
  Deno.mkdirSync(buildDirectoryMap.viewsDirectoryPath);
  return {
    stewBuildId,
    buildDirectoryMap,
  };
}

interface WriteSegmentViewsApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap"> {
  someSegmentSourceConfig: SourceSegmentConfig;
}

function writeSegmentViews(api: WriteSegmentViewsApi) {
  const { someSegmentSourceConfig, buildDirectoryMap } = api;
  return Deno.writeTextFile(
    `${buildDirectoryMap.viewsDirectoryPath}/${someSegmentSourceConfig.segmentKey}.json`,
    JSON.stringify(
      someSegmentSourceConfig.segmentViews.reduce<SegmentViewsMap>(
        (viewsMapResult, someViewConfig) => {
          viewsMapResult[someViewConfig.viewKey] = someViewConfig.viewItemIds;
          return viewsMapResult;
        },
        {}
      )
    )
  );
}

interface LoadAndWriteSegmentModuleApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap"> {
  stewSourceDirectoryPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
  loadedSegmentModules: Record<string, SegmentModule<SegmentItem>>;
}

async function loadAndWriteSegmentModule(api: LoadAndWriteSegmentModuleApi) {
  const {
    stewSourceDirectoryPath,
    loadedSegmentModules,
    someSegmentSourceConfig,
    buildDirectoryMap,
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
    `${buildDirectoryMap.modulesDirectoryPath}/${someSegmentSourceConfig.segmentKey}.js`,
    segmentModuleIifeScript
  );
  await Deno.writeTextFile(
    `${buildDirectoryMap.stylesDirectoryPath}/${someSegmentSourceConfig.segmentKey}.css`,
    segmentModuleCss
  );
}

interface LoadAndWriteSegmentDatasetApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap"> {
  segmentDatasetPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
}

async function loadAndWriteSegmentDataset(api: LoadAndWriteSegmentDatasetApi) {
  const { segmentDatasetPath, someSegmentSourceConfig, buildDirectoryMap } =
    api;
  const [segmentDataset] = await loadBasicModule<SegmentDataset<SegmentItem>>({
    ModuleResultSchema: Zod.array(SegmentItemSchema()),
    moduleEntryPath: segmentDatasetPath,
  });
  await Deno.writeTextFile(
    `${buildDirectoryMap.datasetsDirectoryPath}/${someSegmentSourceConfig.segmentKey}.json`,
    JSON.stringify(segmentDataset)
  );
}

interface GetStewBuildConfigApi
  extends Pick<LoadStewSourceConfigResult, "stewSourceConfig">,
    Pick<ReturnType<typeof setupBuildDirectories>, "stewBuildId"> {
  loadedSegmentModules: Record<string, SegmentModule<SegmentItem>>;
}

function getStewBuildConfig(api: GetStewBuildConfigApi) {
  const { stewBuildId, stewSourceConfig, loadedSegmentModules } = api;
  return {
    stewBuildConfig: {
      stewBuildId,
      stewInfo: stewSourceConfig.stewInfo,
      stewSegments: stewSourceConfig.stewSegments.reduce<
        BuildStewConfig["stewSegments"]
      >((buildSegmentsResult, someSourceSegmentConfig, segmentIndex) => {
        buildSegmentsResult[someSourceSegmentConfig.segmentKey] = {
          segmentIndex,
          segmentKey: someSourceSegmentConfig.segmentKey,
          segmentSearchLabel: someSourceSegmentConfig.segmentSearchLabel,
          segmentViews: someSourceSegmentConfig.segmentViews.reduce<
            BuildStewConfig["stewSegments"][string]["segmentViews"]
          >((buildViewsResult, someViewSourceConfig, viewIndex) => {
            buildViewsResult[someViewSourceConfig.viewKey] = {
              viewIndex,
              viewKey: someViewSourceConfig.viewKey,
              viewLabel: someViewSourceConfig.viewLabel,
            };
            return buildViewsResult;
          }, {}),
          segmentSortOptions: loadedSegmentModules[
            someSourceSegmentConfig.segmentKey
          ].segmentSortOptions.map((someSegmentSortOption) => ({
            sortOptionKey: someSegmentSortOption.sortOptionKey,
            sortOptionLabel: someSegmentSortOption.sortOptionLabel,
          })),
        };
        return buildSegmentsResult;
      }, {}),
    } satisfies BuildStewConfig,
  };
}

interface FetchBundledAssetsAndWriteCoreBuildFilesApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap"> {
  stewBuildConfig: BuildStewConfig;
}

async function fetchBundledAssetsAndWriteCoreBuildFiles(
  api: FetchBundledAssetsAndWriteCoreBuildFilesApi
) {
  const { buildDirectoryMap, stewBuildConfig } = api;
  const { bundleAssetsDataMap } = await fetchBundledAssets();
  Deno.writeTextFileSync(
    buildDirectoryMap.configPath,
    JSON.stringify(stewBuildConfig)
  );
  Deno.writeTextFileSync(
    buildDirectoryMap.appScript,
    bundleAssetsDataMap.appScript
  );
  Deno.writeTextFileSync(buildDirectoryMap.appCss, bundleAssetsDataMap.appCss);
  (window as any).h = preactH;
  const initialStewHtmlComponent: FunctionComponent<any> = loadModuleBundle({
    moduleExportKey: "InitialStewHtml",
    moduleIifeBundleScript: bundleAssetsDataMap.initialHtmlScript,
  });
  Deno.writeTextFileSync(
    buildDirectoryMap.indexHtml,
    `<!DOCTYPE html>${preactRenderToString(
      preactH(initialStewHtmlComponent, {
        stewBuildConfig,
        splashPageCss: bundleAssetsDataMap.splashPageCss,
      })
    )}`
  );
}

interface BundledAssetsDataMap {
  appScript: string;
  appCss: string;
  initialHtmlScript: string;
  splashPageCss: string;
}

async function fetchBundledAssets(): Promise<{
  bundleAssetsDataMap: BundledAssetsDataMap;
}> {
  const bundledAssetClientPathMap = getBundledAssetsLocationMap({
    baseLocation: getDirectoryPath(import.meta.url),
  });
  const [appScript, appCss, initialHtmlScript, splashPageCss] =
    await Promise.all([
      fetchBundleAsset({
        bundledAssetUrl: bundledAssetClientPathMap.appScript,
      }),
      fetchBundleAsset({
        bundledAssetUrl: bundledAssetClientPathMap.appCss,
      }),
      fetchBundleAsset({
        bundledAssetUrl: bundledAssetClientPathMap.initialHtmlScript,
      }),
      fetchBundleAsset({
        bundledAssetUrl: bundledAssetClientPathMap.splashPageCss,
      }),
    ]);
  return {
    bundleAssetsDataMap: {
      appScript,
      appCss,
      initialHtmlScript,
      splashPageCss,
    },
  };
}

interface FetchBundleAssetApi {
  bundledAssetUrl: string;
}

function fetchBundleAsset(api: FetchBundleAssetApi) {
  const { bundledAssetUrl } = api;
  return fetch(bundledAssetUrl).then((getBundleAssetResponse) =>
    getBundleAssetResponse.text()
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
  const iifeBundleResult: unknown = loadModuleBundle({
    moduleExportKey: "default",
    moduleIifeBundleScript: iifeBundleScript,
  });
  return [ModuleResultSchema.parse(iifeBundleResult), iifeBundleScript];
}
