import { FunctionComponent, h as preactH } from "../shared/deps/preact/mod.ts";
import {
  bundleModule,
  bundlePreactModule,
  loadModuleBundle,
} from "../shared/general/bundleModule.ts";
import { getBundledAssetsLocationMap } from "../shared/general/getBundledAssetsLocationMap.ts";
import { throwInvalidPathError } from "../shared/general/throwInvalidPathError.ts";
import { SegmentItem } from "../shared/types/SegmentDataset.ts";
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
import { getDirectoryPath, joinPaths } from "./deps/std/path.ts";
import { getStewResourceMap } from "./shared/general/getStewResourceMap.ts";
import { StewResourceMap } from "./shared/types/StewResourceMap.ts";

export interface BuildStewAppApi {
  stewSourceConfigPath: string;
  maybeBuildDirectoryPath: string | null;
}

export async function buildStewApp(api: BuildStewAppApi) {
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
    const { currentSegmentModule } = await loadAndWriteSegmentModule({
      buildDirectoryMap,
      stewSourceDirectoryPath,
      someSegmentSourceConfig,
    });
    await writeSegmentDatasetAndViews({
      buildDirectoryMap,
      someSegmentSourceConfig,
      currentSegmentModule,
    });
    loadedSegmentModules[someSegmentSourceConfig.segmentKey] =
      currentSegmentModule;
  }
  const { stewBuildConfig } = getStewBuildConfig({
    stewSourceConfig,
    stewBuildId,
    loadedSegmentModules,
  });
  await Promise.all([
    fetchBundledAssetsAndWriteCoreBuildFiles({
      buildDirectoryMap,
      stewBuildConfig,
    }),
    fetchAndWriteSecondaryAssetFiles({
      buildDirectoryMap,
    }),
    writeAppManifestFile({
      buildDirectoryMap,
      stewBuildConfig,
    }),
  ]);
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
  const sourceConfigBundleResult = await bundleModule({
    moduleEntryPath: stewSourceConfigPath,
    tsConfig: {},
    additionalEsbuildPlugins: [],
  });
  const sourceConfigIifeScript = sourceConfigBundleResult.outputFiles[0].text;
  const stewSourceConfigResult: unknown = await loadModuleBundle({
    moduleExportKey: "default",
    moduleIifeBundleScript: sourceConfigIifeScript,
  });
  const stewSourceConfig: SourceStewConfig = SourceStewConfigSchema().parse(
    stewSourceConfigResult
  );
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

interface LoadAndWriteSegmentModuleApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap"> {
  stewSourceDirectoryPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
}

interface LoadAndWriteSegmentModuleResult {
  currentSegmentModule: SegmentModule<SegmentItem>;
}

async function loadAndWriteSegmentModule(
  api: LoadAndWriteSegmentModuleApi
): Promise<LoadAndWriteSegmentModuleResult> {
  const {
    stewSourceDirectoryPath,
    someSegmentSourceConfig,
    buildDirectoryMap,
  } = api;
  const [segmentModuleIifeScript, segmentModuleCss] = await bundlePreactModule({
    moduleEntryPath: joinPaths(
      stewSourceDirectoryPath,
      someSegmentSourceConfig.segmentModulePath
    ),
  });
  // todo: validate currentSegmentModule as SegmentModule<SegmentItem>
  const currentSegmentModule = loadModuleBundle({
    moduleExportKey: "default",
    moduleIifeBundleScript: segmentModuleIifeScript,
  }) as any as SegmentModule<SegmentItem>;
  await Promise.all([
    Deno.writeTextFile(
      `${buildDirectoryMap.modulesDirectoryPath}/${someSegmentSourceConfig.segmentKey}.js`,
      segmentModuleIifeScript
    ),
    Deno.writeTextFile(
      `${buildDirectoryMap.stylesDirectoryPath}/${someSegmentSourceConfig.segmentKey}.css`,
      segmentModuleCss
    ),
  ]);
  return { currentSegmentModule };
}

interface WriteSegmentDatasetAndViewsApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap">,
    Pick<LoadAndWriteSegmentModuleResult, "currentSegmentModule"> {
  someSegmentSourceConfig: SourceSegmentConfig;
}

function writeSegmentDatasetAndViews(api: WriteSegmentDatasetAndViewsApi) {
  const { someSegmentSourceConfig, buildDirectoryMap, currentSegmentModule } =
    api;
  const segmentItemIndicesMap = someSegmentSourceConfig.segmentDataset.reduce<
    Record<string, number>
  >((segmentDatasetMapResult, someSegmentItem, segmentItemIndex) => {
    segmentDatasetMapResult[someSegmentItem.itemId] = segmentItemIndex;
    return segmentDatasetMapResult;
  }, {});
  return Promise.all([
    Deno.writeTextFile(
      `${buildDirectoryMap.datasetsDirectoryPath}/${someSegmentSourceConfig.segmentKey}.json`,
      JSON.stringify(
        someSegmentSourceConfig.segmentDataset.map((someSegmentItem) => ({
          ...someSegmentItem,
          __segment_item_search_space: currentSegmentModule
            .getSegmentItemSearchString(someSegmentItem)
            .toLowerCase(),
        }))
      )
    ),
    Deno.writeTextFile(
      `${buildDirectoryMap.viewsDirectoryPath}/${someSegmentSourceConfig.segmentKey}.json`,
      JSON.stringify(
        someSegmentSourceConfig.segmentViews.reduce<SegmentViewsMap>(
          (viewsMapResult, someViewConfig) => {
            viewsMapResult[someViewConfig.viewKey] =
              someViewConfig.viewItemIds.map(
                (someSegmentItemId) =>
                  segmentItemIndicesMap[someSegmentItemId] ??
                  throwInvalidPathError(
                    "writeSegmentDatasetAndViews.someSegmentItemId"
                  )
              );
            return viewsMapResult;
          },
          {}
        )
      )
    ),
  ]);
}

interface GetStewBuildConfigApi
  extends Pick<LoadStewSourceConfigResult, "stewSourceConfig">,
    Pick<ReturnType<typeof setupBuildDirectories>, "stewBuildId"> {
  loadedSegmentModules: Record<string, SegmentModule<SegmentItem>>;
}

interface GetStewBuildConfigResult {
  stewBuildConfig: BuildStewConfig;
}

function getStewBuildConfig(
  api: GetStewBuildConfigApi
): GetStewBuildConfigResult {
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
          segmentLabel: someSourceSegmentConfig.segmentLabel,
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
          ].segmentSortOptions.reduce<
            BuildStewConfig["stewSegments"][string]["segmentSortOptions"]
          >(
            (
              segmentSortOptionsResult,
              someSegmentSortOption,
              sortOptionIndex
            ) => {
              segmentSortOptionsResult[someSegmentSortOption.sortOptionKey] = {
                sortOptionIndex,
                sortOptionKey: someSegmentSortOption.sortOptionKey,
                sortOptionLabel: someSegmentSortOption.sortOptionLabel,
              };
              return segmentSortOptionsResult;
            },
            {}
          ),
        };
        return buildSegmentsResult;
      }, {}),
    },
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

interface FetchAndWriteSecondaryAssetFilesApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap"> {}

function fetchAndWriteSecondaryAssetFiles(
  api: FetchAndWriteSecondaryAssetFilesApi
) {
  const { buildDirectoryMap } = api;
  const repoRootDirectoryPath = joinPaths(
    getDirectoryPath(import.meta.url),
    "../"
  );
  Deno.mkdirSync(buildDirectoryMap.stewAssetsDirectoryPath);
  return Promise.all(
    [
      {
        terminalSecondaryAssetUrl: "/assets/robots.txt",
        secondaryAssetBuildPath: buildDirectoryMap.robotsTxt,
      },
      {
        terminalSecondaryAssetUrl: "/assets/favicon.ico",
        secondaryAssetBuildPath: buildDirectoryMap.faviconIco,
      },
      {
        terminalSecondaryAssetUrl: "/assets/favicon.svg",
        secondaryAssetBuildPath: buildDirectoryMap.faviconSvg,
      },
      {
        terminalSecondaryAssetUrl: "/assets/icon-192x192.png",
        secondaryAssetBuildPath: buildDirectoryMap.smallIconPng,
      },
      {
        terminalSecondaryAssetUrl: "/assets/icon-384x384.png",
        secondaryAssetBuildPath: buildDirectoryMap.mediumIconPng,
      },
      {
        terminalSecondaryAssetUrl: "/assets/icon-512x512.png",
        secondaryAssetBuildPath: buildDirectoryMap.largeIconPng,
      },
      {
        terminalSecondaryAssetUrl: "/assets/icon-2048x2048.png",
        secondaryAssetBuildPath: buildDirectoryMap.extraLargeIconPng,
      },
      {
        terminalSecondaryAssetUrl: "/assets/fonts/RedHatMonoVF.woff2",
        secondaryAssetBuildPath: buildDirectoryMap.normalFontWoff,
      },
      {
        terminalSecondaryAssetUrl: "/assets/fonts/RedHatMonoVF-Italic.woff2",
        secondaryAssetBuildPath: buildDirectoryMap.italicFontWoff,
      },
    ].map((someSecondaryAssetConfig) =>
      fetchSecondaryAsset({
        secondaryAssetUrl: `${repoRootDirectoryPath}${someSecondaryAssetConfig.terminalSecondaryAssetUrl}`,
      }).then((secondaryAssetBlob) => {
        Deno.writeFile(
          someSecondaryAssetConfig.secondaryAssetBuildPath,
          secondaryAssetBlob.stream()
        );
      })
    )
  );
}

interface FetchSecondaryAssetApi {
  secondaryAssetUrl: string;
}

function fetchSecondaryAsset(api: FetchSecondaryAssetApi) {
  const { secondaryAssetUrl } = api;
  return fetch(secondaryAssetUrl).then((getSecondaryAssetResponse) =>
    getSecondaryAssetResponse.blob()
  );
}

interface WriteAppManifestFileApi
  extends Pick<ReturnType<typeof setupBuildDirectories>, "buildDirectoryMap">,
    Pick<GetStewBuildConfigResult, "stewBuildConfig"> {}

function writeAppManifestFile(api: WriteAppManifestFileApi) {
  const { buildDirectoryMap, stewBuildConfig } = api;
  return Deno.writeTextFile(
    buildDirectoryMap.manifestJson,
    JSON.stringify({
      name: `stews.io: ${stewBuildConfig.stewInfo.stewName}`,
      short_name: stewBuildConfig.stewInfo.stewName,
      start_url: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#FFFFFF",
      theme_color: "#FFFFFF",
      icons: [
        {
          src: "assets/icon-192x192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "assets/icon-384x384.png",
          type: "image/png",
          sizes: "384x384",
        },
        {
          src: "assets/icon-512x512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
    })
  );
}
