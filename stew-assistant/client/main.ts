import { loadClientApp } from "../../stew-library/components/blocks/Client/loadClientApp.ts";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import { AssistantApp } from "./AssistantApp.tsx";
//
import exampleSourceAssistantConfig from "../example/assistant.config.tsx";

loadClientApp({
  appGlobals: {},
  clientApp: AssistantApp,
  fetchClientAppProps: loadAssistantResources,
});

async function loadAssistantResources() {
  const assistantBuildId =
    document.documentElement.dataset["build_id"] ??
    throwInvalidPathError("loadAssistantResources.assistantBuildId");
  const appCss = await fetch(`/app.${assistantBuildId}.css`).then(
    (getAppCssResponse) => getAppCssResponse.text()
  );
  return {
    appCss,
    assistantConfig: {
      initialViewConfig: exampleSourceAssistantConfig.assistantViews[0],
      assistantViews: exampleSourceAssistantConfig.assistantViews.reduce<
        Record<string, any>
      >((result, someViewConfig) => {
        result[someViewConfig.viewKey] = someViewConfig;
        return result;
      }, {}),
    },
  };
}
