// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
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
import { h } from "./deps/preact/mod.ts";
import { preactRenderToString } from "./deps/preact/render-to-string.ts";
import { parseDenoArgs } from "./deps/std/flags.ts";
import { getDirectoryPath, joinPaths } from "./deps/std/path.ts";
import { Zod } from "./deps/zod/mod.ts";
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
    });
    // esbuild needs to be closed for process to terminate
    closeEsbuild();
  } else {
    throw new Error(`unrecognized command: ${userStewCommand}`);
  }
}

interface BuildStewAppApi {
  stewSourceConfigPath: string;
}

async function buildStewApp(api: BuildStewAppApi) {
  const { stewSourceConfigPath } = api;
  const stewSourceDirectoryPath = getDirectoryPath(stewSourceConfigPath);
  const {
    modulesBuildDirectoryPath,
    cssBuildDirectoryPath,
    datasetsBuildDirectoryPath,
    stewBuildId,
    buildDirectoryPath,
    publicBuildDirectoryPath,
  } = setupBuildDirectory();
  const { stewSourceConfig } = await loadStewSourceConfig({
    stewSourceConfigPath,
  });
  const loadedSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSegmentSourceConfig of stewSourceConfig.stewSegments) {
    await loadAndWriteSegmentModule({
      stewSourceDirectoryPath,
      modulesBuildDirectoryPath,
      cssBuildDirectoryPath,
      loadedSegmentModules,
      someSegmentSourceConfig,
      segmentModulePath: joinPaths(
        stewSourceDirectoryPath,
        someSegmentSourceConfig.segmentModulePath
      ),
    });
    await loadAndWriteSegmentDataset({
      datasetsBuildDirectoryPath,
      someSegmentSourceConfig,
      segmentDatasetPath: joinPaths(
        getDirectoryPath(stewSourceConfigPath),
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
    publicBuildDirectoryPath,
    stewBuildConfig,
    clientHtmlModule,
  });
}

function setupBuildDirectory() {
  const stewBuildId = getRandomCryptoString({
    length: 6,
    type: "alphanumeric",
  });
  const buildDirectoryPath = `./build_${stewBuildId}`;
  const publicBuildDirectoryPath = `${buildDirectoryPath}/public`;
  const modulesBuildDirectoryPath = `${publicBuildDirectoryPath}/modules`;
  const datasetsBuildDirectoryPath = `${publicBuildDirectoryPath}/datasets`;
  const cssBuildDirectoryPath = `${publicBuildDirectoryPath}/css`;
  Deno.mkdirSync(publicBuildDirectoryPath, { recursive: true });
  Deno.mkdirSync(modulesBuildDirectoryPath);
  Deno.mkdirSync(datasetsBuildDirectoryPath);
  Deno.mkdirSync(cssBuildDirectoryPath);
  return {
    stewBuildId,
    buildDirectoryPath,
    publicBuildDirectoryPath,
    modulesBuildDirectoryPath,
    datasetsBuildDirectoryPath,
    cssBuildDirectoryPath,
  };
}

interface LoadStewSourceConfigApi
  extends Pick<BuildStewAppApi, "stewSourceConfigPath"> {}

async function loadStewSourceConfig(api: LoadStewSourceConfigApi) {
  const { stewSourceConfigPath } = api;
  const [stewSourceConfig] = await loadBasicExternalModule({
    modulePath: stewSourceConfigPath,
    iifeResultName: "stewConfigIifeResult",
    ModuleResultSchema: SourceStewConfigSchema(),
  });
  return {
    stewSourceConfig,
  };
}

interface LoadAndWriteSegmentModuleApi {
  stewSourceDirectoryPath: string;
  segmentModulePath: string;
  modulesBuildDirectoryPath: string;
  cssBuildDirectoryPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
  loadedSegmentModules: Record<string, SegmentModule<SegmentItem>>;
}

async function loadAndWriteSegmentModule(api: LoadAndWriteSegmentModuleApi) {
  const {
    stewSourceDirectoryPath,
    segmentModulePath,
    loadedSegmentModules,
    someSegmentSourceConfig,
    cssBuildDirectoryPath,
    modulesBuildDirectoryPath,
  } = api;
  const [segmentModule, segmentModuleIifeScript] = await loadSegmentModule<
    SegmentModule<SegmentItem>
  >({
    iifeResultName: "segmentModuleResult",
    ModuleResultSchema: Zod.any(),
    stewSourceDirectoryPath,
    modulePath: segmentModulePath,
    segmentKey: someSegmentSourceConfig.segmentKey,
    onSegmentCssProcessed: async (processedSegmentCss) => {
      await Deno.writeTextFile(
        `${cssBuildDirectoryPath}/${someSegmentSourceConfig.segmentKey}.css`,
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

interface LoadAndWriteSegmentDatasetApi {
  segmentDatasetPath: string;
  datasetsBuildDirectoryPath: string;
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
    modulePath: segmentDatasetPath,
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
      "buildDirectoryPath" | "publicBuildDirectoryPath"
    >,
    Pick<ReturnType<typeof loadClientHtmlModule>, "clientHtmlModule"> {
  stewBuildConfig: BuildStewConfig;
}

function writeCoreBuildFiles(api: WriteCoreBuildFilesApi) {
  const {
    publicBuildDirectoryPath,
    stewBuildConfig,
    clientHtmlModule,
    buildDirectoryPath,
  } = api;
  Deno.writeTextFileSync(
    `${publicBuildDirectoryPath}/stew.config.json`,
    JSON.stringify(stewBuildConfig)
  );
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/index.html`,
    `<!DOCTYPE html>${preactRenderToString(
      <clientHtmlModule.InitialStewHtml
        stewBuildConfig={stewBuildConfig}
        splashPageCss={clientHtmlModule.splashPageCss}
      />
    )}`
  );
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/app.${stewBuildConfig.stewBuildId}.js`,
    APP_BUNDLE_JS
  );
}

interface LoadSegmentModuleApi<ModuleResult>
  extends Pick<
    LoadExternalModuleApi<ModuleResult>,
    "modulePath" | "iifeResultName" | "ModuleResultSchema"
  > {
  stewSourceDirectoryPath: string;
  segmentKey: SourceSegmentConfig["segmentKey"];
  onSegmentCssProcessed: (processedSegmentCss: string) => Promise<void>;
}

function loadSegmentModule<ModuleResult>(
  api: LoadSegmentModuleApi<ModuleResult>
) {
  const {
    modulePath,
    iifeResultName,
    ModuleResultSchema,
    segmentKey,
    onSegmentCssProcessed,
    stewSourceDirectoryPath,
  } = api;
  return loadExternalModule({
    modulePath,
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
                  root: stewSourceDirectoryPath,
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

interface LoadBasicExternalModuleApi<ModuleResult>
  extends Pick<
    LoadExternalModuleApi<ModuleResult>,
    "modulePath" | "iifeResultName" | "ModuleResultSchema"
  > {}

function loadBasicExternalModule<ModuleResult>(
  api: LoadBasicExternalModuleApi<ModuleResult>
) {
  const { modulePath, iifeResultName, ModuleResultSchema } = api;
  return loadExternalModule({
    modulePath,
    iifeResultName,
    ModuleResultSchema,
    esbuildPlugins: [],
    tsCompilerOptions: {},
  });
}

interface LoadExternalModuleApi<ModuleResult> {
  modulePath: string;
  iifeResultName: string;
  esbuildPlugins: Array<EsbuildPlugin>;
  tsCompilerOptions: NonNullable<TsconfigRaw["compilerOptions"]>;
  ModuleResultSchema: Zod.ZodType<ModuleResult, Zod.ZodTypeDef, unknown>;
}

async function loadExternalModule<ModuleResult>(
  api: LoadExternalModuleApi<ModuleResult>
): Promise<[ModuleResult, string]> {
  const {
    modulePath,
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
    entryPoints: [modulePath],
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
    `${bundleIifeScript}; return ${iifeResultName}.default;`
  )();
  return [ModuleResultSchema.parse(iifeResult), bundleIifeScript];
}
