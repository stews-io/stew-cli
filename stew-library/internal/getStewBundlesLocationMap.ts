export interface GetStewBundlesLocationMapApi {
  baseLocation: string;
}

export function getStewBundlesLocationMap(api: GetStewBundlesLocationMapApi) {
  const { baseLocation } = api;
  const clientBaseDirectoryPath = `${baseLocation}/stew-assets/stew-bundles`;
  return {
    stewHtmlScript: `${clientBaseDirectoryPath}/STEW_HTML.js`,
    splashPageCss: `${clientBaseDirectoryPath}/STEW_SPLASH_PAGE.css`,
    appScript: `${clientBaseDirectoryPath}/STEW_APP.js`,
    appCss: `${clientBaseDirectoryPath}/STEW_APP.css`,
  };
}
