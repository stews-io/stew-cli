import { loadClientApp } from "../../stew-library/components/blocks/Client/loadClientApp.ts";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import exampleSourceAssistantConfig from "../example/assistant.config.tsx";
import { BuildAssistantConfig } from "../library/AssistantConfig.ts";
import { AssistantApp } from "./AssistantApp.tsx";

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
      assistantEntryFormConfig: exampleSourceAssistantConfig
        .assistantForms[0] as unknown as BuildAssistantConfig["assistantEntryFormConfig"],
      assistantForms: exampleSourceAssistantConfig.assistantForms.reduce<
        BuildAssistantConfig["assistantForms"]
      >((result, someFormConfig) => {
        result[someFormConfig.formKey] =
          someFormConfig as unknown as BuildAssistantConfig["assistantForms"][string];
        return result;
      }, {}),
    },
  };
}
