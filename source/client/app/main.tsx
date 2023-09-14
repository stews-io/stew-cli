import { h, render } from "../../deps/preact/mod.ts";
import { getStewResourceMap } from "../../shared/general/getStewResourceMap.ts";
import { throwInvalidErrorPath } from "../../shared/general/throwInvalidPathError.ts";
import { BuildStewConfig } from "../../shared/types/StewConfig.ts";
import { StewApp } from "./StewApp.tsx";

(window as unknown as any).h = h;
loadApp();

async function loadApp() {
  const { stewConfig, stewResourceMap } = await loadStewConfig();
  render(
    <StewApp stewConfig={stewConfig} stewResourceMap={stewResourceMap} />,
    document.getElementById("appContainer") ??
      throwInvalidErrorPath("hydrate.appContainer")
  );
  document.getElementById("splashPageStyle")?.remove();
  console.info(stewConfig);
}

async function loadStewConfig() {
  const stewBuildId =
    document.getElementById("appScript")?.dataset["stew_build_id"] ??
    throwInvalidErrorPath("loadApp.stewBuildId");
  const stewResourceMap = getStewResourceMap({
    stewBuildId,
  });
  const getConfigResponse = await fetch(stewResourceMap.configPath);
  const stewConfig: BuildStewConfig = await getConfigResponse.json();
  return {
    stewResourceMap,
    stewConfig,
  };
}
