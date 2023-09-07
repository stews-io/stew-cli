// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import {
  dirname as getDirectoryPath,
  join as joinPaths,
  resolve as resolvePath,
} from "deno/std/path/mod.ts";
import { cryptoRandomString as getRandomCryptoString } from "deno/x/crypto-random-string/mod.ts";
import { BundleOptions, bundle } from "deno/x/emit/mod.ts";
import { parse as acornParse } from "npm/acorn";
import { transform as transformEsModuleToIifeModule } from "npm/es-iife";
import { h } from "npm/preact";
import { SegmentItem, SegmentModule } from "./shared/data/SegmentModule.ts";
import {
  BuildStewConfig,
  SourceStewConfigSchema,
} from "./shared/data/StewConfig.ts";
import { renderToString } from "npm/preact-render-to-string";
import { InitialStewHtml } from "./client/auxiliary/InitialStewHtml.tsx";

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
  const { stewSourceConfig } = await fetchStewSourceConfig({
    stewSourceConfigPath,
  });
  const sourceSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSourceSegmentConfig of stewSourceConfig.stewSegments) {
    const segmentModuleIifeResultName = "segmentModuleIifeResult";
    const segmentModuleIifeScript = await bundleEsModuleToIifeScript({
      iifeResultName: segmentModuleIifeResultName,
      someEsModulePath: joinPaths(
        getDirectoryPath(stewSourceConfigPath),
        someSourceSegmentConfig.segmentModulePath
      ),
      moduleCompilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    });
    // mount preact jsx factory onto window so iife evaluation works
    // deno-lint-ignore no-explicit-any
    (window as unknown as any).h = h;
    const maybeSegmentModule: unknown = new Function(
      `${segmentModuleIifeScript}; return ${segmentModuleIifeResultName};`
    )();
    // todo: validate shape
    const segmentModule = maybeSegmentModule as any;
    sourceSegmentModules[someSourceSegmentConfig.segmentKey] = segmentModule;
    // write segment module script
    // write segment dataset json
  }
  const stewBuildConfig: BuildStewConfig = {
    stewBuildId: getRandomCryptoString({
      length: 6,
      type: "alphanumeric",
    }),
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
  const buildDirectoryPath = `./build_${stewBuildConfig.stewBuildId}`;
  Deno.mkdirSync(buildDirectoryPath);
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
  const stewSourceConfigResultName = "stewConfigIifeResult";
  const stewSourceConfigIifeScript = await bundleEsModuleToIifeScript({
    someEsModulePath: stewSourceConfigPath,
    iifeResultName: stewSourceConfigResultName,
    moduleCompilerOptions: {},
  });
  const maybeStewSourceConfig: unknown = new Function(
    `${stewSourceConfigIifeScript}; return ${stewSourceConfigResultName};`
  )();
  const stewSourceConfig = SourceStewConfigSchema().parse(
    maybeStewSourceConfig
  );
  return {
    stewSourceConfig,
  };
}

interface BundleEsModuleToIifeScriptApi {
  someEsModulePath: string;
  iifeResultName: string;
  moduleCompilerOptions: NonNullable<BundleOptions["compilerOptions"]>;
}

async function bundleEsModuleToIifeScript(api: BundleEsModuleToIifeScriptApi) {
  const { someEsModulePath, moduleCompilerOptions, iifeResultName } = api;
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
  return bundleIifeScript;
}

function throwInvalidErrorPath(errorMessage: string): never {
  throw new Error(`invalid path: ${errorMessage}`);
}
