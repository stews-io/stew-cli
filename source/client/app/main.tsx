import {
  h as preactH,
  render as preactRender,
} from "../../../shared/deps/preact/mod.ts";
import { throwInvalidPathError } from "../../../shared/general/throwInvalidPathError.ts";
import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { getStewResourceMap } from "../../shared/general/getStewResourceMap.ts";
import { StewApp } from "./StewApp.tsx";

(window as unknown as any).h = preactH;
loadApp();

async function loadApp() {
  const { stewConfig, stewResourceMap } = await loadStewConfig();
  preactRender(
    <StewApp stewConfig={stewConfig} stewResourceMap={stewResourceMap} />,
    document.getElementById("appContainer") ??
      throwInvalidPathError("hydrate.appContainer")
  );
  document.getElementById("splashPageStyle")?.remove();
  console.info(stewConfig);
}

async function loadStewConfig() {
  const stewBuildId =
    document.getElementById("appScript")?.dataset["stew_build_id"] ??
    throwInvalidPathError("loadApp.stewBuildId");
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
