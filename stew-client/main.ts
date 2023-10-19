import * as Preact from "../stew-library/deps/preact/mod.ts";
import * as PreactHooks from "../stew-library/deps/preact/hooks.ts";
import * as StewComponents from "../stew-library/components/mod.ts";
import * as StewHooks from "../stew-library/hooks/mod.ts";
import { loadClientApp } from "../stew-library/components/blocks/Client/loadClientApp.ts";
import { BuildStewConfig } from "../stew-library/config/mod.ts";
import { getStewResourceMap } from "../stew-library/internal/getStewResourceMap.ts";
import {
  findMapItem,
  throwInvalidPathError,
} from "../stew-library/utilities/mod.ts";
import { StewApp, StewAppProps } from "./StewApp/StewApp.tsx";
import { fetchSegmentComponents } from "./StewApp/fetchSegmentComponents.ts";

loadClientApp({
  clientApp: StewApp,
  fetchClientAppProps: loadStewResources,
  appGlobals: {
    Preact,
    PreactHooks,
    StewComponents,
    StewHooks,
  },
});

async function loadStewResources(): Promise<StewAppProps> {
  // display splash page for minimum amount of time
  const minimumSplashDisplayPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 700);
  });
  const stewBuildId =
    document.documentElement.dataset["build_id"] ??
    throwInvalidPathError("loadStewResources.stewBuildId");
  const stewResourceMap = getStewResourceMap({
    stewBuildId,
  });
  const stewConfig = await fetch(stewResourceMap.configPath).then(
    (getConfigResponse) =>
      getConfigResponse.json() as unknown as BuildStewConfig
  );
  console.info(stewConfig);
  const [_, urlSegmentKey] = window.location.pathname.split("/");
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
    initialSegmentConfig.segmentViews[
      initialSearchParams.get("view") ?? "__EMPTY_VIEW_KEY__"
    ] ??
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
  const fetchStewAppCss = fetch(`/app.${stewConfig.stewBuildId}.css`).then(
    (getStewAppCssResponse) => getStewAppCssResponse.text()
  );
  const regularRedHatMonoFontFace = new FontFace(
    "Red Hat Mono",
    "url(/assets/RedHatMonoVF.woff2)",
    {
      weight: "200 900",
    }
  );
  const italicRedHatMonoFontFace = new FontFace(
    "Red Hat Mono",
    "url(/assets/RedHatMonoVF-Italic.woff2)",
    {
      style: "italic",
      weight: "200 900",
    }
  );
  (document.fonts as any).add(regularRedHatMonoFontFace);
  (document.fonts as any).add(italicRedHatMonoFontFace);
  regularRedHatMonoFontFace.load();
  italicRedHatMonoFontFace.load();
  const [
    [
      initialSegmentDataset,
      initialSegmentModule,
      initialSegmentViewsMap,
      initialSegmentCss,
    ],
    stewAppCss,
  ] = await Promise.all([
    fetchInitialSegmentComponentsResult,
    fetchStewAppCss,
    document.fonts.ready,
    minimumSplashDisplayPromise,
  ]);
  return {
    stewResourceMap,
    stewConfig,
    stewAppCss,
    // what if errorLoadingSegment => currently splash page just hangs without notifying user
    initialSegmentViewState: {
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
    },
  };
}
