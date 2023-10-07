import { getDirectoryPath, joinPaths } from "./deps/std/path.ts";

export interface SetupStewProjectApi {
  stewPackageVersion: string;
  projectDirectoryPath: string;
}

export async function setupStewProject(api: SetupStewProjectApi) {
  const { projectDirectoryPath, stewPackageVersion } = api;
  const boilerplateAssetsDirectoryPath = joinPaths(
    getDirectoryPath(import.meta.url),
    "../stew-assets/project-boilerplate"
  );
  await Promise.all([
    writeVercelJsonFile({
      projectDirectoryPath,
    }),
    writeDenoJsonFile({
      projectDirectoryPath,
      stewPackageVersion,
    }),
    fetchAndWriteTypesDeclarationFile({
      projectDirectoryPath,
      boilerplateAssetsDirectoryPath,
    }),
    fetchAndWriteGitignoreFile({
      projectDirectoryPath,
      boilerplateAssetsDirectoryPath,
    }),
    fetchAndWriteGithubWorkflowFiles({
      projectDirectoryPath,
      boilerplateAssetsDirectoryPath,
    }),
    fetchAndWriteSourceFiles({
      projectDirectoryPath,
      boilerplateAssetsDirectoryPath,
    }),
  ]);
}

interface WriteDenoJsonFileApi
  extends Pick<
    SetupStewProjectApi,
    "projectDirectoryPath" | "stewPackageVersion"
  > {}

async function writeDenoJsonFile(api: WriteDenoJsonFileApi) {
  const { projectDirectoryPath, stewPackageVersion } = api;
  await Deno.writeTextFile(
    joinPaths(projectDirectoryPath, "./deno.json"),
    JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          jsxImportSource: "preact",
        },
        imports: {
          CssModule: "./declaration.d.ts",
          preact: "https://esm.sh/preact@10.17.1",
          "preact/hooks": "https://esm.sh/preact@10.17.1/hooks",
          "preact/jsx-runtime": "https://esm.sh/preact@10.17.1/jsx-runtime",
          "stew/": `https://deno.land/x/stew@${stewPackageVersion}/stew-library/`,
        },
        tasks: {
          buildStew: `rm -rf ./build && deno run -A https://raw.githubusercontent.com/stews-io/toolkit/${stewPackageVersion}/stew-command/main.ts build ./source/stew.config.ts`,
          serveStew: `deno run -A https://raw.githubusercontent.com/stews-io/toolkit/${stewPackageVersion}/development-scripts/serveStewBuild.ts ./build`,
          buildAndServeStew: "deno task buildStew && deno task serveStew",
        },
      },
      null,
      2
    )
  );
}

interface WriteVercelJsonFileApi
  extends Pick<SetupStewProjectApi, "projectDirectoryPath"> {}

async function writeVercelJsonFile(api: WriteVercelJsonFileApi) {
  const { projectDirectoryPath } = api;
  await Deno.writeTextFile(
    joinPaths(projectDirectoryPath, "./vercel.json"),
    JSON.stringify(
      {
        buildCommand: "deno task buildStew",
        outputDirectory: "build",
        rewrites: [
          {
            source: "/",
            destination: "/index.html",
          },
          {
            source:
              "/:segmentKey((?!stew_))((?!app.))((?!assets))((?!favicon.))((?!manifest.))(.*)",
            destination: "/index.html",
          },
        ],
      },
      null,
      2
    )
  );
}

interface FetchAndWriteTypesDeclarationFileApi
  extends Pick<SetupStewProjectApi, "projectDirectoryPath"> {
  boilerplateAssetsDirectoryPath: string;
}

async function fetchAndWriteTypesDeclarationFile(
  api: FetchAndWriteTypesDeclarationFileApi
) {
  const { boilerplateAssetsDirectoryPath, projectDirectoryPath } = api;
  const typesDeclarationTemplateFile = await fetch(
    joinPaths(boilerplateAssetsDirectoryPath, "./declaration.d.ts.TEMPLATE")
  ).then((fileResponse) => fileResponse.text());
  await Deno.writeTextFile(
    joinPaths(projectDirectoryPath, "./declaration.d.ts"),
    typesDeclarationTemplateFile
  );
}

interface FetchAndWriteGitignoreFileApi
  extends Pick<SetupStewProjectApi, "projectDirectoryPath"> {
  boilerplateAssetsDirectoryPath: string;
}

async function fetchAndWriteGitignoreFile(api: FetchAndWriteGitignoreFileApi) {
  const { boilerplateAssetsDirectoryPath, projectDirectoryPath } = api;
  const typesDeclarationTemplateFile = await fetch(
    joinPaths(boilerplateAssetsDirectoryPath, "./.gitignore.TEMPLATE")
  ).then((fileResponse) => fileResponse.text());
  await Deno.writeTextFile(
    joinPaths(projectDirectoryPath, "./.gitignore"),
    typesDeclarationTemplateFile
  );
}

interface FetchAndWriteGithubWorkflowFilesApi
  extends Pick<SetupStewProjectApi, "projectDirectoryPath"> {
  boilerplateAssetsDirectoryPath: string;
}

async function fetchAndWriteGithubWorkflowFiles(
  api: FetchAndWriteGithubWorkflowFilesApi
) {
  const { projectDirectoryPath, boilerplateAssetsDirectoryPath } = api;
  const workflowsDirectoryPath = joinPaths(
    projectDirectoryPath,
    "./.github/workflows"
  );
  await Deno.mkdir(workflowsDirectoryPath, {
    recursive: true,
  });
  await Promise.all([
    fetchAndWriteDeployPreviewWorkflowFile({
      boilerplateAssetsDirectoryPath,
      workflowsDirectoryPath,
    }),
    fetchAndWriteDeployProductionWorkflowFile({
      boilerplateAssetsDirectoryPath,
      workflowsDirectoryPath,
    }),
  ]);
}

interface FetchAndWriteDeployPreviewWorkflowFileApi
  extends Pick<
    FetchAndWriteGithubWorkflowFilesApi,
    "boilerplateAssetsDirectoryPath"
  > {
  workflowsDirectoryPath: string;
}

async function fetchAndWriteDeployPreviewWorkflowFile(
  api: FetchAndWriteDeployPreviewWorkflowFileApi
) {
  const { boilerplateAssetsDirectoryPath, workflowsDirectoryPath } = api;
  const deployPreviewWorkflowTemplateFile = await fetch(
    joinPaths(boilerplateAssetsDirectoryPath, "./deploy-preview.yaml.TEMPLATE")
  ).then((fileResponse) => fileResponse.text());
  await Deno.writeTextFile(
    joinPaths(workflowsDirectoryPath, "./deploy-preview.yaml"),
    deployPreviewWorkflowTemplateFile
  );
}

interface FetchAndWriteDeployProductionWorkflowFileApi
  extends Pick<
    FetchAndWriteGithubWorkflowFilesApi,
    "boilerplateAssetsDirectoryPath"
  > {
  workflowsDirectoryPath: string;
}

async function fetchAndWriteDeployProductionWorkflowFile(
  api: FetchAndWriteDeployProductionWorkflowFileApi
) {
  const { boilerplateAssetsDirectoryPath, workflowsDirectoryPath } = api;
  const deployProductionWorkflowTemplateFile = await fetch(
    joinPaths(
      boilerplateAssetsDirectoryPath,
      "./deploy-production.yaml.TEMPLATE"
    )
  ).then((fileResponse) => fileResponse.text());
  await Deno.writeTextFile(
    joinPaths(workflowsDirectoryPath, "./deploy-production.yaml"),
    deployProductionWorkflowTemplateFile
  );
}

interface FetchAndWriteSourceFilesApi
  extends Pick<SetupStewProjectApi, "projectDirectoryPath"> {
  boilerplateAssetsDirectoryPath: string;
}

async function fetchAndWriteSourceFiles(api: FetchAndWriteSourceFilesApi) {
  const { projectDirectoryPath, boilerplateAssetsDirectoryPath } = api;
  const sourceDirectoryPath = joinPaths(projectDirectoryPath, "./source");
  const linksSegmentDirectoryPath = joinPaths(sourceDirectoryPath, "./links");
  await Deno.mkdir(linksSegmentDirectoryPath, {
    recursive: true,
  });
  await Promise.all([
    fetchAndWriteStewConfigFile({
      boilerplateAssetsDirectoryPath,
      sourceDirectoryPath,
    }),
    // fetchAndWriteLinksModule(),
    // fetchAndWriteLinksDataset(),
    // fetchAndWriteLinkItemDisplay(),
    // fetchAndWriteLinkItem(),
  ]);
}

interface FetchAndWriteStewConfigFileApi
  extends Pick<FetchAndWriteSourceFilesApi, "boilerplateAssetsDirectoryPath"> {
  sourceDirectoryPath: string;
}

async function fetchAndWriteStewConfigFile(
  api: FetchAndWriteStewConfigFileApi
) {
  const { boilerplateAssetsDirectoryPath, sourceDirectoryPath } = api;
  const deployProductionWorkflowTemplateFile = await fetch(
    joinPaths(boilerplateAssetsDirectoryPath, "./stew.config.ts.TEMPLATE")
  ).then((fileResponse) => fileResponse.text());
  await Deno.writeTextFile(
    joinPaths(sourceDirectoryPath, "./stew.config.ts"),
    deployProductionWorkflowTemplateFile
  );
}
