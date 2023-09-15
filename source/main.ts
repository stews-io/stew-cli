import { Esbuild } from "../shared/deps/esbuild/mod.ts";
import { FunctionComponent, h as preactH } from "../shared/deps/preact/mod.ts";
import { Zod } from "../shared/deps/zod/mod.ts";
import {
  BundleModuleApi,
  bundleModule,
  bundlePreactModule,
  loadModuleBundle,
} from "../shared/general/bundleModule.ts";
import { getBundledAssetsClientPathMap } from "../shared/general/getBundledAssetsClientPathMap.ts";
import { throwInvalidPathError } from "../shared/general/throwInvalidPathError.ts";
import {
  SegmentDataset,
  SegmentItem,
  SegmentItemSchema,
} from "../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../shared/types/SegmentModule.ts";
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
    await loadAndWriteSegmentModule({
      buildDirectoryMap,
      stewSourceDirectoryPath,
      loadedSegmentModules,
      someSegmentSourceConfig,
    });
    await loadAndWriteSegmentDataset({
      buildDirectoryMap,
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
  return {
    stewBuildId,
    buildDirectoryMap,
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

interface BundledAssetsDataMap {
  appScript: string;
  appCss: string;
  initialHtmlScript: string;
  splashPageCss: string;
}

async function fetchBundledAssets(): Promise<{
  bundleAssetsDataMap: BundledAssetsDataMap;
}> {
  const bundledAssetClientPathMap = getBundledAssetsClientPathMap();
  const scriptBaseDirectoryUrl = getDirectoryPath(import.meta.url);
  const [appScript, appCss, initialHtmlScript, splashPageCss] =
    await Promise.all([
      fetchBundleAsset({
        bundledAssetUrl: `${scriptBaseDirectoryUrl}${bundledAssetClientPathMap.appScript}`,
      }),
      fetchBundleAsset({
        bundledAssetUrl: `${scriptBaseDirectoryUrl}${bundledAssetClientPathMap.appCss}`,
      }),
      fetchBundleAsset({
        bundledAssetUrl: `${scriptBaseDirectoryUrl}${bundledAssetClientPathMap.initialHtmlScript}`,
      }),
      fetchBundleAsset({
        bundledAssetUrl: `${scriptBaseDirectoryUrl}${bundledAssetClientPathMap.splashPageCss}`,
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
