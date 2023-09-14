import { SourceStewConfig } from "../mod.ts";
import { APP_BUNDLE_JS } from "./client/bundled-assets/APP_BUNDLE_JS.ts";
import { INITIAL_HTML_BUNDLE_JS } from "./client/bundled-assets/INITIAL_HTML_BUNDLE_JS.ts";
import { SPLASH_PAGE_CSS } from "./client/bundled-assets/SPLASH_PAGE_CSS.ts";
import { getRandomCryptoString } from "./deps/crypto-random-string/mod.ts";
import { denoLoaderPlugins } from "./deps/esbuild/deno_loader.ts";
import {
  EsbuildPlugin,
  TsconfigRaw,
  closeEsbuild,
  runEsbuild,
} from "./deps/esbuild/mod.ts";
import { PostcssPlugin, postcssProcessor } from "./deps/postcss/mod.ts";
import { postcssImportTransformer } from "./deps/postcss/postcss-import.ts";
import { postcssMinifyPlugin } from "./deps/postcss/postcss-minify.ts";
import { postcssModulesPlugin } from "./deps/postcss/postcss-modules.ts";
import { postcssNestingPlugin } from "./deps/postcss/postcss-nesting.ts";
import { FunctionComponent, h } from "./deps/preact/mod.ts";
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
  const { clientHtmlModule } = loadClientHtmlModule();
  writeCoreBuildFiles({
    buildDirectoryPath,
    configBuildPath,
    stewBuildConfig,
    clientHtmlModule,
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
  const [stewSourceConfig] = await loadBasicExternalModule({
    moduleEntryPath: stewSourceConfigPath,
    iifeResultName: "stewConfigIifeResult",
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
  // Deno.removeSync(buildDirectoryPath, { recursive: true });
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
  stewSourceDirectoryPath: LoadSegmentModuleApi<
    SegmentModule<SegmentItem>
  >["cssImportBaseDirectoryPath"];
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
  const [segmentModule, segmentModuleIifeScript] = await loadSegmentModule<
    SegmentModule<SegmentItem>
  >({
    iifeResultName: "segmentModuleResult",
    ModuleResultSchema: Zod.any(),
    cssImportBaseDirectoryPath: stewSourceDirectoryPath,
    segmentKey: someSegmentSourceConfig.segmentKey,
    moduleEntryPath: joinPaths(
      stewSourceDirectoryPath,
      someSegmentSourceConfig.segmentModulePath
    ),
    onSegmentCssProcessed: async (processedSegmentCss) => {
      await Deno.writeTextFile(
        `${stylesBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.css`,
        processedSegmentCss
      );
    },
  });
  await Deno.writeTextFile(
    `${modulesBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.js`,
    segmentModuleIifeScript
  );
  loadedSegmentModules[someSegmentSourceConfig.segmentKey] = segmentModule;
}

interface LoadSegmentModuleApi<ModuleResult>
  extends Pick<
    LoadExternalModuleApi<ModuleResult>,
    "moduleEntryPath" | "iifeResultName" | "ModuleResultSchema"
  > {
  cssImportBaseDirectoryPath: string;
  segmentKey: SourceSegmentConfig["segmentKey"];
  onSegmentCssProcessed: (processedSegmentCss: string) => Promise<void>;
}

function loadSegmentModule<ModuleResult>(
  api: LoadSegmentModuleApi<ModuleResult>
) {
  const {
    moduleEntryPath,
    iifeResultName,
    ModuleResultSchema,
    segmentKey,
    onSegmentCssProcessed,
    cssImportBaseDirectoryPath,
  } = api;
  return loadExternalModule({
    moduleEntryPath,
    iifeResultName,
    ModuleResultSchema,
    tsCompilerOptions: {
      jsxFactory: "h",
      jsxFragmentFactory: "Fragment",
    },
    esbuildPlugins: [
      {
        name: "stew-css-esbuild-plugin",
        setup(buildContext) {
          buildContext.onLoad({ filter: /\.css$/ }, async (cssLoaderConfig) => {
            let cssExportMapResult: Record<string, string> = {};
            const processedCssResult = await postcssProcessor([
              postcssNestingPlugin(),
              postcssModulesPlugin({
                getJSON: (cssFilename, nextCssExportMapResult) => {
                  cssExportMapResult = nextCssExportMapResult;
                },
                generateScopedName: `${segmentKey}_[hash:base64:6]`,
              }) as PostcssPlugin,
              postcssMinifyPlugin(),
            ])
              .use(
                postcssImportTransformer({
                  root: cssImportBaseDirectoryPath,
                })
              )
              .process(Deno.readTextFileSync(cssLoaderConfig.path));
            await onSegmentCssProcessed(processedCssResult.css);
            return {
              loader: "json",
              contents: JSON.stringify(cssExportMapResult),
            };
          });
        },
      },
    ],
  });
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
  const [segmentDataset] = await loadBasicExternalModule<
    SegmentDataset<SegmentItem>
  >({
    iifeResultName: "segmentDatasetResult",
    ModuleResultSchema: Zod.array(SegmentItemSchema()),
    moduleEntryPath: segmentDatasetPath,
  });
  await Deno.writeTextFile(
    `${datasetsBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.json`,
    JSON.stringify(segmentDataset)
  );
}

function loadClientHtmlModule() {
  (window as unknown as any).h = h;
  return {
    clientHtmlModule: {
      InitialStewHtml: new Function(
        `${INITIAL_HTML_BUNDLE_JS}return _clientHtml.InitialStewHtml`
      )(),
      splashPageCss: SPLASH_PAGE_CSS,
    },
  };
}

interface WriteCoreBuildFilesApi
  extends Pick<
      ReturnType<typeof setupBuildDirectory>,
      "buildDirectoryPath" | "configBuildPath"
    >,
    Pick<ReturnType<typeof loadClientHtmlModule>, "clientHtmlModule"> {
  stewBuildConfig: BuildStewConfig;
}

function writeCoreBuildFiles(api: WriteCoreBuildFilesApi) {
  const {
    configBuildPath,
    stewBuildConfig,
    clientHtmlModule,
    buildDirectoryPath,
  } = api;
  Deno.writeTextFileSync(configBuildPath, JSON.stringify(stewBuildConfig));
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/index.html`,
    `<!DOCTYPE html>${preactRenderToString(
      h(clientHtmlModule.InitialStewHtml as FunctionComponent<any>, {
        stewBuildConfig,
        splashPageCss: clientHtmlModule.splashPageCss,
      })
    )}`
  );
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/app.${stewBuildConfig.stewBuildId}.js`,
    APP_BUNDLE_JS
  );
}

interface LoadBasicExternalModuleApi<ModuleResult>
  extends Pick<
    LoadExternalModuleApi<ModuleResult>,
    "moduleEntryPath" | "iifeResultName" | "ModuleResultSchema"
  > {}

function loadBasicExternalModule<ModuleResult>(
  api: LoadBasicExternalModuleApi<ModuleResult>
) {
  const { moduleEntryPath, iifeResultName, ModuleResultSchema } = api;
  return loadExternalModule({
    moduleEntryPath,
    iifeResultName,
    ModuleResultSchema,
    esbuildPlugins: [],
    tsCompilerOptions: {},
  });
}

interface LoadExternalModuleApi<ModuleResult> {
  moduleEntryPath: string;
  iifeResultName: string;
  esbuildPlugins: Array<EsbuildPlugin>;
  tsCompilerOptions: NonNullable<TsconfigRaw["compilerOptions"]>;
  ModuleResultSchema: Zod.ZodType<ModuleResult, Zod.ZodTypeDef, unknown>;
}

async function loadExternalModule<ModuleResult>(
  api: LoadExternalModuleApi<ModuleResult>
): Promise<[ModuleResult, string]> {
  const {
    moduleEntryPath,
    iifeResultName,
    esbuildPlugins,
    tsCompilerOptions,
    ModuleResultSchema,
  } = api;
  const buildBundleResult = await runEsbuild({
    bundle: true,
    write: false,
    minify: true,
    outdir: "out",
    format: "iife",
    globalName: iifeResultName,
    entryPoints: [moduleEntryPath],
    plugins: [
      ...esbuildPlugins,
      ...(denoLoaderPlugins({
        loader: "portable",
        configPath: `${Deno.cwd()}/deno.json`,
      }) as Array<EsbuildPlugin>),
    ],
    tsconfigRaw: {
      compilerOptions: tsCompilerOptions,
    },
  });
  const bundleIifeScript = buildBundleResult.outputFiles[0].text;
  const iifeResult: unknown = new Function(
    // note: not sure semicolon is necessary
    `${bundleIifeScript};return ${iifeResultName}.default;`
  )();
  return [ModuleResultSchema.parse(iifeResult), bundleIifeScript];
}
