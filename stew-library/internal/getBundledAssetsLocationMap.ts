export interface GetBundledAssetsLocationMapApi {
  baseLocation: string;
}

export function getBundledAssetsLocationMap(
  api: GetBundledAssetsLocationMapApi
) {
  const { baseLocation } = api;
  const clientBaseDirectoryPath = `${baseLocation}/stew-assets/client-bundles`;
  return {
    initialHtmlScript: `${clientBaseDirectoryPath}/INITIAL_HTML.js`,
    splashPageCss: `${clientBaseDirectoryPath}/SPLASH_PAGE.css`,
    appScript: `${clientBaseDirectoryPath}/APP.js`,
    appCss: `${clientBaseDirectoryPath}/APP.css`,
  };
}
