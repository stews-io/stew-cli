import { render, h } from "npm/preact";
import { StewApp } from "./StewApp.tsx";
import { throwInvalidErrorPath } from "../../shared/general/throwInvalidPathError.ts";
import { BuildStewConfig } from "../../shared/types/StewConfig.ts";

(window as unknown as any).h = h;
loadApp();

async function loadApp() {
  const getConfigResponse = await fetch("/public/stew.config.json");
  const stewConfig: BuildStewConfig = await getConfigResponse.json();
  render(
    <StewApp stewConfig={stewConfig} />,
    document.getElementById("appContainer") ??
      throwInvalidErrorPath("hydrate.appContainer")
  );
  document.getElementById("splashPageStyle")?.remove();
  console.info(stewConfig);
}
