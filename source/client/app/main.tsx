import {
  h as preactH,
  render as preactRender,
} from "../../../shared/deps/preact/mod.ts";
import { throwInvalidPathError } from "../../../shared/general/throwInvalidPathError.ts";
import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { getStewResourceMap } from "../../shared/general/getStewResourceMap.ts";
import { StewApp } from "./StewApp.tsx";
import { StewState } from "./StewState.ts";
import { fetchSegmentComponents } from "./fetchSegmentComponents.ts";

(window as unknown as any).h = preactH;
loadStewApp();

async function loadStewApp() {
  const { stewConfig, stewResourceMap, initialStewState } =
    await loadStewResources();
  preactRender(
    <StewApp
      stewConfig={stewConfig}
      stewResourceMap={stewResourceMap}
      initialStewState={initialStewState}
    />,
    document.getElementById("appContainer") ??
      throwInvalidPathError("hydrate.appContainer")
  );
  document.getElementById("splashPageStyle")?.remove();
  console.info(stewConfig);
}

async function loadStewResources() {
  // display splash page for minimum amount of time
  const minimumSplashDisplayPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 700);
  });
  const stewBuildId =
    document.getElementById("appScript")?.dataset["stew_build_id"] ??
    throwInvalidPathError("loadStewResources.stewBuildId");
  const stewResourceMap = getStewResourceMap({
    stewBuildId,
  });
  const stewConfig = await fetch(stewResourceMap.configPath).then(
    (getConfigResponse) =>
      getConfigResponse.json() as unknown as BuildStewConfig
  );
  const [_, urlSegmentKey, urlViewKey] = window.location.pathname.split("/");
  const initialSearchParams = new URLSearchParams(window.location.search);
  const initialSegmentConfig =
    Object.values(stewConfig.stewSegments).find(
      (someSegmentConfig) => someSegmentConfig.segmentKey === urlSegmentKey
    ) ??
    Object.values(stewConfig.stewSegments).find(
      (someSegmentConfig) => someSegmentConfig.segmentIndex === 0
    ) ??
    throwInvalidPathError("initialSegmentConfig");
  const fetchInitialSegmentComponentsResult = fetchSegmentComponents({
    stewResourceMap,
    someSegmentKey: initialSegmentConfig.segmentKey,
  });
  const initialSegmentViewConfig =
    Object.values(initialSegmentConfig.segmentViews).find(
      (someViewConfig) => someViewConfig.viewKey === urlViewKey
    ) ??
    Object.values(initialSegmentConfig.segmentViews).find(
      (someViewConfig) => someViewConfig.viewIndex === 0
    ) ??
    throwInvalidPathError("initialSegmentViewConfig");
  const initialSegmentSortOptionConfig =
    initialSegmentConfig.segmentSortOptions.find(
      (someOptionConfig) =>
        someOptionConfig.sortOptionKey === initialSearchParams.get("sort")
    ) ?? initialSegmentConfig.segmentSortOptions[0];
  const [
    [
      initialSegmentDataset,
      initialSegmentModule,
      initialSegmentViewsMap,
      initialSegmentCss,
    ],
  ] = await Promise.all([
    fetchInitialSegmentComponentsResult,
    minimumSplashDisplayPromise,
  ]);
  return {
    stewResourceMap,
    stewConfig,
    // what if errorLoadingSegment
    initialStewState: {
      viewPageIndex: 0,
      segmentStatus: "segmentLoaded",
      segmentDataset: initialSegmentDataset,
      segmentModule: initialSegmentModule,
      segmentViewsMap: initialSegmentViewsMap,
      segmentCss: initialSegmentCss,
      segmentKey: initialSegmentConfig.segmentKey,
      segmentViewKey: initialSegmentViewConfig.viewKey,
      segmentSortKey: initialSegmentSortOptionConfig.sortOptionKey,
      viewSearchQuery: initialSearchParams.get("search") ?? "",
    } satisfies StewState,
  };
}
