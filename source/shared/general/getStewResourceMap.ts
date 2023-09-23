import { StewResourceMap } from "../types/StewResourceMap.ts";

export interface GetStewResourceMapApi<StewBuildId extends string> {
  stewBuildId: StewBuildId;
}

export function getStewResourceMap<StewBuildId extends string>(
  api: GetStewResourceMapApi<StewBuildId>
): StewResourceMap<StewBuildId> {
  const { stewBuildId } = api;
  const stewResourcesDirectoryPath: `/stew_${StewBuildId}` = `/stew_${stewBuildId}`;
  const stewAssetsDirectoryPath = "/assets";
  return {
    stewResourcesDirectoryPath,
    stewAssetsDirectoryPath,
    indexHtml: "/index.html",
    faviconIco: "/favicon.ico",
    faviconSvg: "/favicon.svg",
    normalFontWoff: "/assets/RedHatMonoVF.woff2",
    italicFontWoff: "/assets/RedHatMonoVF-Italic.woff2",
    smallIconPng: "/assets/icon-192x192.png",
    mediumIconPng: "/assets/icon-384x384.png",
    largeIconPng: "/assets/icon-512x512.png",
    extraLargeIconPng: "/assets/icon-2048x2048.png",
    appScript: `/app.${stewBuildId}.js`,
    appCss: `/app.${stewBuildId}.css`,
    configPath: `${stewResourcesDirectoryPath}/stew.config.json`,
    modulesDirectoryPath: `${stewResourcesDirectoryPath}/modules`,
    datasetsDirectoryPath: `${stewResourcesDirectoryPath}/datasets`,
    stylesDirectoryPath: `${stewResourcesDirectoryPath}/styles`,
    viewsDirectoryPath: `${stewResourcesDirectoryPath}/views`,
  };
}
