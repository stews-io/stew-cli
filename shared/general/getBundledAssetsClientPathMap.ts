export function getBundledAssetsClientPathMap() {
  const clientBaseDirectoryPath = "/client/__bundled-assets__";
  return {
    initialHtmlScript: `${clientBaseDirectoryPath}/INITIAL_HTML.js`,
    splashPageCss: `${clientBaseDirectoryPath}/SPLASH_PAGE.css`,
    appScript: `${clientBaseDirectoryPath}/APP.js`,
    appCss: `${clientBaseDirectoryPath}/APP.css`,
  };
}
