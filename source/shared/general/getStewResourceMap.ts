import { StewResourceMap } from "../types/StewResourceMap.ts";

export interface GetStewResourceMapApi<StewBuildId extends string> {
  stewBuildId: StewBuildId;
}

export function getStewResourceMap<StewBuildId extends string>(
  api: GetStewResourceMapApi<StewBuildId>
): StewResourceMap<StewBuildId> {
  const { stewBuildId } = api;
  const stewResourcesDirectoryPath: `/stew_${StewBuildId}` = `/stew_${stewBuildId}`;
  return {
    stewResourcesDirectoryPath,
    indexHtml: "/index.html",
    appScript: `/app.${stewBuildId}.js`,
    appCss: `/app.${stewBuildId}.css`,
    configPath: `${stewResourcesDirectoryPath}/stew.config.json`,
    modulesDirectoryPath: `${stewResourcesDirectoryPath}/modules`,
    datasetsDirectoryPath: `${stewResourcesDirectoryPath}/datasets`,
    stylesDirectoryPath: `${stewResourcesDirectoryPath}/styles`,
  };
}
