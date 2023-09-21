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
import { findMapItem } from "./findMapItem.ts";

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
    stewConfig.stewSegments[urlSegmentKey] ??
    findMapItem({
      itemTargetValue: 0,
      itemSearchKey: "segmentIndex",
      someMap: stewConfig.stewSegments,
    }) ??
    throwInvalidPathError("initialSegmentConfig");
  const fetchInitialSegmentComponentsResult = fetchSegmentComponents({
    stewResourceMap,
    someSegmentKey: initialSegmentConfig.segmentKey,
  });
  const initialSegmentViewConfig =
    initialSegmentConfig.segmentViews[urlViewKey] ??
    findMapItem({
      itemTargetValue: 0,
      itemSearchKey: "viewIndex",
      someMap: initialSegmentConfig.segmentViews,
    }) ??
    throwInvalidPathError("initialSegmentViewConfig");
  const initialSegmentSortOptionConfig =
    initialSegmentConfig.segmentSortOptions[
      initialSearchParams.get("sort") ?? "__EMPTY_SORT_KEY__"
    ] ??
    findMapItem({
      itemTargetValue: 0,
      itemSearchKey: "sortOptionIndex",
      someMap: initialSegmentConfig.segmentSortOptions,
    }) ??
    throwInvalidPathError("initialSegmentSortOptionConfig");
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
    // what if errorLoadingSegment => currently splash page just hangs without notifying user
    initialStewState: {
      viewPageIndex: 0,
      segmentStatus: "segmentLoaded",
      segmentDataset: initialSegmentDataset,
      segmentModule: initialSegmentModule,
      segmentViewsMap: initialSegmentViewsMap,
      segmentCss: initialSegmentCss,
      segmentKey: initialSegmentConfig.segmentKey,
      segmentViewKey: initialSegmentViewConfig.viewKey,
      segmentSortOptionKey: initialSegmentSortOptionConfig.sortOptionKey,
      viewSearchQuery: initialSearchParams.get("search") ?? "",
    } satisfies StewState,
  };
}
