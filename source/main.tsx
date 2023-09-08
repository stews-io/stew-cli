// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import {
  dirname as getDirectoryPath,
  join as joinPaths,
} from "deno/std/path/mod.ts";
import { cryptoRandomString as getRandomCryptoString } from "deno/x/crypto-random-string/mod.ts";
import { BundleOptions, bundle } from "deno/x/emit/mod.ts";
import * as Zod from "deno/x/zod/mod.ts";
import { parse as acornParse } from "npm/acorn";
import { transform as transformEsModuleToIifeModule } from "npm/es-iife";
import { renderToString } from "npm/preact-render-to-string";
import { InitialStewHtml } from "./client/auxiliary/InitialStewHtml.tsx";
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
  const { stewSourceConfig } = await fetchStewSourceConfig({
    stewSourceConfigPath,
  });
  const sourceSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSourceSegmentConfig of stewSourceConfig.stewSegments) {
    // segmentModule
    const [segmentModule, segmentModuleIifeScript] = await loadEsModule<
      SegmentModule<SegmentItem>
    >({
      iifeResultName: "segmentModuleResult",
      someEsModulePath: joinPaths(
        getDirectoryPath(stewSourceConfigPath),
        someSourceSegmentConfig.segmentModulePath
      ),
      moduleCompilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
      ModuleResultSchema: Zod.any(),
    });
    sourceSegmentModules[someSourceSegmentConfig.segmentKey] = segmentModule;
    Deno.writeTextFileSync(
      `${modulesDirectoryPath}/${someSourceSegmentConfig.segmentKey}.js`,
      segmentModuleIifeScript
    );
    // segmentDataset
    const [segmentDataset] = await loadEsModule<SegmentDataset<SegmentItem>>({
      iifeResultName: "segmentDatasetResult",
      someEsModulePath: joinPaths(
        getDirectoryPath(stewSourceConfigPath),
        someSourceSegmentConfig.segmentDatasetPath
      ),
      moduleCompilerOptions: {},
      ModuleResultSchema: Zod.array(SegmentItemSchema()),
    });
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

interface FetchStewSourceConfigApi
  extends Pick<BuildStewAppApi, "stewSourceConfigPath"> {}

async function fetchStewSourceConfig(api: FetchStewSourceConfigApi) {
  const { stewSourceConfigPath } = api;
  const [stewSourceConfig] = await loadEsModule({
    someEsModulePath: stewSourceConfigPath,
    iifeResultName: "stewConfigIifeResult",
    moduleCompilerOptions: {},
    ModuleResultSchema: SourceStewConfigSchema(),
  });
  return {
    stewSourceConfig,
  };
}

interface LoadEsModuleApi<ModuleResult> {
  someEsModulePath: string;
  iifeResultName: string;
  moduleCompilerOptions: NonNullable<BundleOptions["compilerOptions"]>;
  ModuleResultSchema: Zod.ZodType<ModuleResult, Zod.ZodTypeDef, unknown>;
}

async function loadEsModule<ModuleResult>(
  api: LoadEsModuleApi<ModuleResult>
): Promise<[ModuleResult, string]> {
  const {
    someEsModulePath,
    iifeResultName,
    moduleCompilerOptions,
    ModuleResultSchema,
  } = api;
  const esModuleBundle = await bundle(someEsModulePath, {
    compilerOptions: moduleCompilerOptions,
  });
  const bundleIifeScript: string = transformEsModuleToIifeModule({
    code: esModuleBundle.code,
    name: iifeResultName,
    parse: (code: string) =>
      acornParse(code, {
        sourceType: "module",
        ecmaVersion: 2020,
      }),
  }).code;
  const iifeResult: unknown = new Function(
    `${bundleIifeScript}; return ${iifeResultName};`
  )();
  return [ModuleResultSchema.parse(iifeResult), bundleIifeScript];
}

function throwInvalidErrorPath(errorMessage: string): never {
  throw new Error(`invalid path: ${errorMessage}`);
}
