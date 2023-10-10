import { getDirectoryPath, joinPaths } from "../deps/std/path.ts";

export interface SetupStewProjectApi {
  projectDirectoryPath: string;
}

export async function setupStewProject(api: SetupStewProjectApi) {
  const { projectDirectoryPath } = api;
  const projectTemplatesDirectoryPath = joinPaths(
    getDirectoryPath(import.meta.url),
    "../stew-assets/project-templates"
  );
  const workflowsDirectoryPath = joinPaths(
    projectDirectoryPath,
    "./.github/workflows"
  );
  const sourceDirectoryPath = joinPaths(projectDirectoryPath, "./source");
  const linksSegmentDirectoryPath = joinPaths(sourceDirectoryPath, "./links");
  await Promise.all([
    Deno.mkdir(workflowsDirectoryPath, {
      recursive: true,
    }),
    Deno.mkdir(linksSegmentDirectoryPath, {
      recursive: true,
    }),
  ]);
  await Promise.all([
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: projectDirectoryPath,
      templateFilename: "vercel.json",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: projectDirectoryPath,
      templateFilename: "deno.json",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: projectDirectoryPath,
      templateFilename: "declaration.d.ts",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: projectDirectoryPath,
      templateFilename: ".gitignore",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: workflowsDirectoryPath,
      templateFilename: "deploy-preview.yaml",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: workflowsDirectoryPath,
      templateFilename: "deploy-production.yaml",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: sourceDirectoryPath,
      templateFilename: "stew.config.ts",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: linksSegmentDirectoryPath,
      templateFilename: "LinkItem.ts",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: linksSegmentDirectoryPath,
      templateFilename: "LinkItemDisplay.tsx",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: linksSegmentDirectoryPath,
      templateFilename: "links.module.ts",
    }),
    fetchAndWriteProjectTemplateFile({
      projectTemplatesDirectoryPath,
      outputDirectoryPath: linksSegmentDirectoryPath,
      templateFilename: "links.dataset.ts",
    }),
  ]);
}

interface FetchAndWriteProjectTemplateFileApi {
  templateFilename: string;
  projectTemplatesDirectoryPath: string;
  outputDirectoryPath: string;
}

async function fetchAndWriteProjectTemplateFile(
  api: FetchAndWriteProjectTemplateFileApi
) {
  const {
    projectTemplatesDirectoryPath,
    templateFilename,
    outputDirectoryPath,
  } = api;
  const linksDatasetTemplateFile = await fetch(
    joinPaths(projectTemplatesDirectoryPath, `./${templateFilename}.TEMPLATE`)
  ).then((fileResponse) => fileResponse.text());
  await Deno.writeTextFile(
    joinPaths(outputDirectoryPath, templateFilename),
    linksDatasetTemplateFile
  );
}
