// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
import { parse as parseDenoArgs } from "deno/std/flags/mod.ts";
import {
  join as joinPaths,
  dirname as getDirectoryPath,
  resolve as resolvePath,
} from "deno/std/path/mod.ts";
import { cryptoRandomString as getRandomCryptoString } from "deno/x/crypto-random-string/mod.ts";
import { bundle } from "deno/x/emit/mod.ts";
import { parse as acornParse } from "npm/acorn";
import { transform as transformEsModuleToIifeModule } from "npm/es-iife";
import { h } from "npm/preact";
import {
  BuildStewConfig,
  SourceStewConfig,
  SourceStewConfigSchema,
} from "./shared/data/StewConfig.ts";
import { renderToString } from "npm/preact-render-to-string";
import { InitialStewHtml } from "./client/auxiliary/InitialStewHtml.tsx";
import { SegmentItem, SegmentModule } from "./shared/data/StewSegmentModule.ts";

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
    const maybeSourceStewConfigPath =
      typeof parsedDenoArgs._[1] === "string"
        ? parsedDenoArgs._[1]
        : throwInvalidErrorPath("parsedDenoArgs._[1]");
    await buildStewApp({
      sourceStewConfigPath: maybeSourceStewConfigPath,
    });
  } else {
    throw new Error(`unrecognized command: ${userStewCommand}`);
  }
}

interface BuildStewAppApi {
  sourceStewConfigPath: string;
}

async function buildStewApp(api: BuildStewAppApi) {
  const { sourceStewConfigPath } = api;
  const absoluteSourceStewConfigPath = resolvePath(sourceStewConfigPath);
  const sourceStewConfigBundle = await bundle(absoluteSourceStewConfigPath);
  const sourceStewConfigIifeModule = transformEsModuleToIifeModule({
    code: sourceStewConfigBundle.code,
    name: "stewConfigIifeResult",
    parse: (code: string) =>
      acornParse(code, {
        sourceType: "module",
        ecmaVersion: 2020,
      }),
  });
  const maybeSourceStewConfig: unknown = new Function(
    `${sourceStewConfigIifeModule.code}; return stewConfigIifeResult;`
  )();
  const sourceStewConfig: SourceStewConfig = SourceStewConfigSchema().parse(
    maybeSourceStewConfig
  );
  const sourceSegmentModules: Record<string, SegmentModule<SegmentItem>> = {};
  for (const someSourceSegmentConfig of sourceStewConfig.stewSegments) {
    const absoluteSegmentModulePath = joinPaths(
      getDirectoryPath(absoluteSourceStewConfigPath),
      someSourceSegmentConfig.segmentModuleUrl
    );
    const segmentModuleBundle = await bundle(absoluteSegmentModulePath, {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    });
    const segmentModuleIifeResultName = "segmentModuleIifeResult";
    const segmentModuleIifeModule = transformEsModuleToIifeModule({
      code: segmentModuleBundle.code,
      name: segmentModuleIifeResultName,
      parse: (code: string) =>
        acornParse(code, {
          sourceType: "module",
          ecmaVersion: 2020,
        }),
    });
    // mount preact jsx factory onto window so iife evaluation works
    // deno-lint-ignore no-explicit-any
    (window as unknown as any).h = h;
    const maybeSegmentModule: unknown = new Function(
      `${segmentModuleIifeModule.code}; return ${segmentModuleIifeResultName};`
    )();
    sourceSegmentModules[someSourceSegmentConfig.segmentKey] =
      maybeSegmentModule as any;
  }
  const buildStewConfig: BuildStewConfig = {
    stewBuildId: getRandomCryptoString({
      length: 6,
      type: "alphanumeric",
    }),
    stewInfo: sourceStewConfig.stewInfo,
    stewSegments: sourceStewConfig.stewSegments.map(
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
  console.log(buildStewConfig);
  // transform client config to build config
  // const buildDirectoryPath = `./${stewConfig.stewInfo.stewName}_build[${buildIdentifier}]`;
  // Deno.mkdirSync(buildDirectoryPath);
  // Deno.writeTextFileSync(
  //   `${buildDirectoryPath}/index.html`,
  //   `<!DOCTYPE html>${renderToString(<InitialStewHtml />)}`
  // );
}

function throwInvalidErrorPath(errorMessage: string): never {
  throw new Error(`invalid path: ${errorMessage}`);
}
