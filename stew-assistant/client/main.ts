import { loadClientApp } from "../../stew-library/components/blocks/Client/loadClientApp.ts";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import { BuildAssistantConfig } from "../library/config/AssistantConfig.ts";
import { AssistantApp } from "./AssistantApp.tsx";
//
import exampleAssistantConfig from "../example/assistant.config.tsx";

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
      initialAssistantView: exampleAssistantConfig
        .assistantViews[0] as BuildAssistantConfig["initialAssistantView"],
      assistantViews: exampleAssistantConfig.assistantViews.reduce<
        BuildAssistantConfig["assistantViews"]
      >((assistantViewsResult, someViewConfig) => {
        assistantViewsResult[someViewConfig.viewKey] =
          someViewConfig as BuildAssistantConfig["assistantViews"][number];
        return assistantViewsResult;
      }, {}),
    },
  };
}
