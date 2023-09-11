import { hydrate, h } from "npm/preact";
import { StewApp } from "./StewApp.tsx";
import { throwInvalidErrorPath } from "../../shared/general/throwInvalidPathError.ts";
import { BuildStewConfig } from "../../shared/types/StewConfig.ts";

(window as unknown as any).h = h;
loadApp();

async function loadApp() {
  const getConfigResponse = await fetch("/public/stew.config.json");
  const stewConfig: BuildStewConfig = await getConfigResponse.json();
  hydrate(
    <StewApp stewConfig={stewConfig} />,
    document.getElementById("appContainer") ??
      throwInvalidErrorPath("hydrate.appContainer")
  );
  console.info(stewConfig);
}
