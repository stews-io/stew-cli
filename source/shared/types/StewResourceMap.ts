export interface StewResourceMap<
  StewBuildId extends string = string,
  StewResourcesDirectoryPath extends `/stew_${StewBuildId}` = `/stew_${StewBuildId}`
> {
  indexHtml: "/index.html";
  appScript: `/app.${StewBuildId}.js`;
  appCss: `/app.${StewBuildId}.css`;
  stewResourcesDirectoryPath: StewResourcesDirectoryPath;
  configPath: `${StewResourcesDirectoryPath}/stew.config.json`;
  modulesDirectoryPath: `${StewResourcesDirectoryPath}/modules`;
  datasetsDirectoryPath: `${StewResourcesDirectoryPath}/datasets`;
  stylesDirectoryPath: `${StewResourcesDirectoryPath}/styles`;
  viewsDirectoryPath: `${StewResourcesDirectoryPath}/views`;
}
