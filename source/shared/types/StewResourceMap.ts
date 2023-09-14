export interface StewResourceMap<
  StewBuildId extends string = string,
  StewResourcesDirectoryPath extends `/stew_${StewBuildId}` = `/stew_${StewBuildId}`
> {
  stewResourcesDirectoryPath: StewResourcesDirectoryPath;
  configPath: `${StewResourcesDirectoryPath}/stew.config.json`;
  modulesDirectoryPath: `${StewResourcesDirectoryPath}/modules`;
  datasetsDirectoryPath: `${StewResourcesDirectoryPath}/datasets`;
  stylesDirectoryPath: `${StewResourcesDirectoryPath}/styles`;
}
