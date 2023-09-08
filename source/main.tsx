// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import {
  dirname as getDirectoryPath,
  join as joinPaths,
  resolve,
} from "deno/std/path/mod.ts";
import { cryptoRandomString as getRandomCryptoString } from "deno/x/crypto-random-string/mod.ts";
import { TsconfigRaw } from "deno/x/esbuild/mod.d.ts";
import {
  build as buildBundle,
  stop as closeEsbuild,
} from "deno/x/esbuild/mod.js";
import { denoPlugins } from "deno/x/esbuild_deno_loader/mod.ts";
import * as Zod from "deno/x/zod/mod.ts";
import { renderToString } from "npm/preact-render-to-string";
import { InitialStewHtml } from "./client/auxiliary/InitialStewHtml.tsx";
import { throwInvalidErrorPath } from "./shared/general/throwInvalidPathError.ts";
import {
  SegmentDataset,
  SegmentItem,
  SegmentItemSchema,
} from "./shared/types/SegmentDataset.ts";
import { SegmentModule } from "./shared/types/SegmentModule.ts";
import {
  BuildStewConfig,
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
  const stewBuildId = getRandomCryptoString({
    length: 6,
    type: "alphanumeric",
  });
  const buildDirectoryPath = `./build_${stewBuildId}`;
  const publicDirectoryPath = `${buildDirectoryPath}/public`;
  const modulesDirectoryPath = `${publicDirectoryPath}/modules`;
  const datasetsDirectoryPath = `${publicDirectoryPath}/datasets`;
  Deno.mkdirSync(publicDirectoryPath, { recursive: true });
  Deno.mkdirSync(modulesDirectoryPath);
  Deno.mkdirSync(datasetsDirectoryPath);
  const { stewSourceConfig } = await loadStewSourceConfig({
    stewSourceConfigPath,
  });
  const sourceSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSourceSegmentConfig of stewSourceConfig.stewSegments) {
    // segmentModule
    const [segmentModule, segmentModuleIifeScript] = await loadPreactModule<
      SegmentModule<SegmentItem>
    >({
      iifeResultName: "segmentModuleResult",
      ModuleResultSchema: Zod.any(),
      modulePath: joinPaths(
        getDirectoryPath(stewSourceConfigPath),
        someSourceSegmentConfig.segmentModulePath
      ),
    });
    sourceSegmentModules[someSourceSegmentConfig.segmentKey] = segmentModule;
    Deno.writeTextFileSync(
      `${modulesDirectoryPath}/${someSourceSegmentConfig.segmentKey}.js`,
      segmentModuleIifeScript
    );
    // segmentDataset
    const [segmentDataset] = await loadBasicModule<SegmentDataset<SegmentItem>>(
      {
        iifeResultName: "segmentDatasetResult",
        ModuleResultSchema: Zod.array(SegmentItemSchema()),
        modulePath: joinPaths(
          getDirectoryPath(stewSourceConfigPath),
          someSourceSegmentConfig.segmentDatasetPath
        ),
      }
    );
    Deno.writeTextFileSync(
      `${datasetsDirectoryPath}/${someSourceSegmentConfig.segmentKey}.json`,
      JSON.stringify(segmentDataset)
    );
  }
  const stewBuildConfig: BuildStewConfig = {
    stewBuildId,
    stewInfo: stewSourceConfig.stewInfo,
    stewSegments: stewSourceConfig.stewSegments.map(
      (someSourceSegmentConfig) => ({
        segmentKey: someSourceSegmentConfig.segmentKey,
        segmentSearchLabel: someSourceSegmentConfig.segmentSearchLabel,
        segmentViews: someSourceSegmentConfig.segmentViews,
        segmentSortOptions: sourceSegmentModules[
          someSourceSegmentConfig.segmentKey
        ].segmentSortOptions.map((someSegmentSortOption) => ({
          sortOptionKey: someSegmentSortOption.sortOptionKey,
          sortOptionLabel: someSegmentSortOption.sortOptionLabel,
        })),
      })
    ),
  };
  Deno.writeTextFileSync(
    `${buildDirectoryPath}/index.html`,
    `<!DOCTYPE html>${renderToString(
      <InitialStewHtml stewBuildConfig={stewBuildConfig} />
    )}`
  );
}

interface LoadStewSourceConfigApi
  extends Pick<BuildStewAppApi, "stewSourceConfigPath"> {}

async function loadStewSourceConfig(api: LoadStewSourceConfigApi) {
  const { stewSourceConfigPath } = api;
  const [stewSourceConfig] = await loadBasicModule({
    modulePath: stewSourceConfigPath,
    iifeResultName: "stewConfigIifeResult",
    ModuleResultSchema: SourceStewConfigSchema(),
  });
  return {
    stewSourceConfig,
  };
}

interface LoadPreactModuleApi<ModuleResult>
  extends Pick<
    LoadModuleApi<ModuleResult>,
    "modulePath" | "iifeResultName" | "ModuleResultSchema"
  > {}

function loadPreactModule<ModuleResult>(
  api: LoadPreactModuleApi<ModuleResult>
) {
  const { modulePath, iifeResultName, ModuleResultSchema } = api;
  return loadModule({
    modulePath,
    iifeResultName,
    ModuleResultSchema,
    tsCompilerOptions: {
      jsxFactory: "h",
      jsxFragmentFactory: "Fragment",
    },
  });
}

interface LoadBasicModuleApi<ModuleResult>
  extends Pick<
    LoadModuleApi<ModuleResult>,
    "modulePath" | "iifeResultName" | "ModuleResultSchema"
  > {}

function loadBasicModule<ModuleResult>(api: LoadBasicModuleApi<ModuleResult>) {
  const { modulePath, iifeResultName, ModuleResultSchema } = api;
  return loadModule({
    modulePath,
    iifeResultName,
    ModuleResultSchema,
    tsCompilerOptions: {},
  });
}

interface LoadModuleApi<ModuleResult> {
  modulePath: string;
  iifeResultName: string;
  tsCompilerOptions: NonNullable<TsconfigRaw["compilerOptions"]>;
  ModuleResultSchema: Zod.ZodType<ModuleResult, Zod.ZodTypeDef, unknown>;
}

async function loadModule<ModuleResult>(
  api: LoadModuleApi<ModuleResult>
): Promise<[ModuleResult, string]> {
  const { modulePath, iifeResultName, tsCompilerOptions, ModuleResultSchema } =
    api;
  const buildBundleResult = await buildBundle({
    bundle: true,
    write: false,
    minify: true,
    outdir: "out",
    format: "iife",
    globalName: iifeResultName,
    entryPoints: [modulePath],
    plugins: [
      ...(denoPlugins({
        loader: "portable",
        configPath: resolve(`${Deno.cwd()}/deno.json`),
      }) as unknown as any),
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
