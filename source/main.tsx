// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import {
  dirname as getDirectoryPath,
  join as joinPaths,
} from "deno/std/path/mod.ts";
import { cryptoRandomString as getRandomCryptoString } from "deno/x/crypto-random-string/mod.ts";
import { TsconfigRaw } from "deno/x/esbuild/mod.d.ts";
import {
  Plugin as EsbuildPlugin,
  build as buildBundle,
  stop as closeEsbuild,
} from "deno/x/esbuild/mod.js";
import { denoPlugins } from "deno/x/esbuild_deno_loader/mod.ts";
import * as Zod from "deno/x/zod/mod.ts";
import { renderToString } from "npm/preact-render-to-string";
import { APP_BUNDLE_JS } from "./client/app/APP_BUNDLE_JS.ts";
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
// import { HTML_BUNDLE_JS } from "./client/html/HTML_BUNDLE_JS.ts";
import postcssProcessor, { AcceptedPlugin } from "npm/postcss";
import postcssModulesPlugin from "npm/postcss-modules";
import postcssNestingPlugin from "npm/postcss-nesting";
import { InitialStewHtml } from "./client/html/InitialStewHtml.tsx";

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
      modulesBuildDirectoryPath,
      cssBuildDirectoryPath,
      loadedSegmentModules,
      someSegmentSourceConfig,
      segmentModulePath: joinPaths(
        getDirectoryPath(stewSourceConfigPath),
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
  writeCoreBuildFiles({
    buildDirectoryPath,
    publicBuildDirectoryPath,
    stewBuildConfig,
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
  segmentModulePath: string;
  modulesBuildDirectoryPath: string;
  cssBuildDirectoryPath: string;
  someSegmentSourceConfig: SourceSegmentConfig;
  loadedSegmentModules: Record<string, SegmentModule<SegmentItem>>;
}

async function loadAndWriteSegmentModule(api: LoadAndWriteSegmentModuleApi) {
  const {
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

interface WriteCoreBuildFilesApi
  extends Pick<
    ReturnType<typeof setupBuildDirectory>,
    "buildDirectoryPath" | "publicBuildDirectoryPath"
  > {
  stewBuildConfig: BuildStewConfig;
}

function writeCoreBuildFiles(api: WriteCoreBuildFilesApi) {
  const { publicBuildDirectoryPath, stewBuildConfig, buildDirectoryPath } = api;
  Deno.writeTextFileSync(
    `${publicBuildDirectoryPath}/stew.config.json`,
    JSON.stringify(stewBuildConfig)
  );
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/index.html`,
    `<!DOCTYPE html>${renderToString(
      <InitialStewHtml stewBuildConfig={stewBuildConfig} />
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
              }) as AcceptedPlugin,
            ]).process(Deno.readTextFileSync(cssLoaderConfig.path));
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
  const buildBundleResult = await buildBundle({
    bundle: true,
    write: false,
    minify: true,
    outdir: "out",
    format: "iife",
    globalName: iifeResultName,
    entryPoints: [modulePath],
    plugins: [
      ...esbuildPlugins,
      ...(denoPlugins({
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
