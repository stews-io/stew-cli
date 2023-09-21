import {
  StateUpdater,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../../../shared/deps/preact/hooks.ts";
import { throwInvalidPathError } from "../../../../shared/general/throwInvalidPathError.ts";
import { BuildSegmentItem } from "../../../../shared/types/SegmentDataset.ts";
import { StewAppProps } from "../StewApp.tsx";
import { findMapItem } from "../general/findMapItem.ts";
import { StewSegmentState } from "./StewSegmentState.ts";
import {
  FetchSegmentComponentsResult,
  fetchSegmentComponents,
} from "./fetchSegmentComponents.ts";

export interface UseStewSegmentApi
  extends Pick<
    StewAppProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {}

export interface UseStewSegmentResult
  extends Pick<UseStewSegmentMutationsResult, "stewSegmentMutations">,
    Pick<UseStewSegmentDataResult, "stewSegmentData"> {
  stewSegmentState: StewSegmentState;
}

export function useStewSegment(api: UseStewSegmentApi): UseStewSegmentResult {
  const { initialSegmentViewState, stewConfig, stewResourceMap } = api;
  const [stewSegmentState, setSegmentViewState] = useState<StewSegmentState>(
    initialSegmentViewState
  );
  const { stewSegmentMutations } = useStewSegmentMutations({
    stewConfig,
    setSegmentViewState,
  });
  const { stewSegmentData } = useStewSegmentData({
    stewConfig,
    stewSegmentState,
    viewPageItemSize: 6,
  });
  useStewSegmentComponents({
    stewResourceMap,
    stewSegmentState,
    updateSegmentComponents: stewSegmentMutations.updateSegmentComponents,
  });
  useStewSegmentUrl({
    stewSegmentState,
  });
  return {
    stewSegmentState,
    stewSegmentMutations,
    stewSegmentData,
  };
}

interface UseStewSegmentMutationsApi
  extends Pick<UseStewSegmentApi, "stewConfig"> {
  setSegmentViewState: StateUpdater<StewSegmentState>;
}

interface UseStewSegmentMutationsResult {
  stewSegmentMutations: StewSegmentMutations;
}

export interface StewSegmentMutations {
  selectStewSegment: (nextSegmentKey: string) => void;
  updateSegmentComponents: (
    nextSegmentComponents: FetchSegmentComponentsResult
  ) => void;
  selectSegmentView: (nextSegmentViewKey: string) => void;
  selectSegmentSortOption: (nextSegmentSortOptionKey: string) => void;
  updateSegmentViewSearch: (nextViewSearchQuery: string) => void;
  clearSegmentViewSearch: () => void;
  gotoPreviousViewPage: () => void;
  gotoNextViewPage: () => void;
}

function useStewSegmentMutations(
  api: UseStewSegmentMutationsApi
): UseStewSegmentMutationsResult {
  const { stewConfig, setSegmentViewState } = api;
  const stewSegmentMutations = useMemo<StewSegmentMutations>(
    () => ({
      selectStewSegment: (nextSegmentKey) => {
        const defaultSegmentViewConfig =
          findMapItem({
            itemTargetValue: 0,
            itemSearchKey: "viewIndex",
            someMap: stewConfig.stewSegments[nextSegmentKey].segmentViews,
          }) ?? throwInvalidPathError("defaultSegmentViewConfig");
        const defaultSegmentSortOptionConfig =
          findMapItem({
            itemTargetValue: 0,
            itemSearchKey: "sortOptionIndex",
            someMap: stewConfig.stewSegments[nextSegmentKey].segmentSortOptions,
          }) ?? throwInvalidPathError("defaultSegmentSortOptionConfig");
        setSegmentViewState({
          viewPageIndex: 0,
          viewSearchQuery: "",
          segmentStatus: "loadingSegment",
          segmentViewKey: defaultSegmentViewConfig.viewKey,
          segmentSortOptionKey: defaultSegmentSortOptionConfig.sortOptionKey,
          segmentKey: nextSegmentKey,
        });
      },
      updateSegmentComponents: ([
        nextSegmentDataset,
        nextSegmentModule,
        nextSegmentViewsMap,
        nextSegmentCss,
      ]) => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          segmentStatus: "segmentLoaded",
          segmentDataset: nextSegmentDataset,
          segmentModule: nextSegmentModule,
          segmentViewsMap: nextSegmentViewsMap,
          segmentCss: nextSegmentCss,
        }));
      },
      selectSegmentView: (nextSegmentViewKey) => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          viewPageIndex: 0,
          segmentViewKey: nextSegmentViewKey,
        }));
      },
      selectSegmentSortOption: (nextSegmentSortOptionKey) => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          viewPageIndex: 0,
          segmentSortOptionKey: nextSegmentSortOptionKey,
        }));
      },
      updateSegmentViewSearch: (nextViewSearchQuery) => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          viewPageIndex: 0,
          viewSearchQuery: nextViewSearchQuery,
        }));
      },
      clearSegmentViewSearch: () => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          viewPageIndex: 0,
          viewSearchQuery: "",
        }));
      },
      gotoPreviousViewPage: () => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          viewPageIndex: currentSegmentViewState.viewPageIndex - 1,
        }));
      },
      gotoNextViewPage: () => {
        setSegmentViewState((currentSegmentViewState) => ({
          ...currentSegmentViewState,
          viewPageIndex: currentSegmentViewState.viewPageIndex - 1,
        }));
      },
    }),
    [stewConfig, setSegmentViewState]
  );
  return {
    stewSegmentMutations,
  };
}

interface UseStewSegmentComponentsApi
  extends Pick<UseStewSegmentApi, "stewResourceMap">,
    Pick<StewSegmentMutations, "updateSegmentComponents"> {
  stewSegmentState: StewSegmentState;
}

function useStewSegmentComponents(api: UseStewSegmentComponentsApi) {
  const { stewSegmentState, stewResourceMap, updateSegmentComponents } = api;
  const segmentSwitchCountRef = useRef(0);
  useEffect(() => {
    if (stewSegmentState.segmentStatus === "loadingSegment") {
      segmentSwitchCountRef.current += 1;
      const correspondingSwitchCount = segmentSwitchCountRef.current;
      fetchSegmentComponents({
        stewResourceMap,
        someSegmentKey: stewSegmentState.segmentKey,
      }).then((nextSegmentComponents) => {
        // guard against updating stewState with stale data
        if (correspondingSwitchCount === segmentSwitchCountRef.current) {
          updateSegmentComponents(nextSegmentComponents);
        }
      });
    }
  }, [stewSegmentState.segmentKey]);
}

interface UseStewSegmentDataApi extends Pick<UseStewSegmentApi, "stewConfig"> {
  viewPageItemSize: number;
  stewSegmentState: StewSegmentState;
}

interface UseStewSegmentDataResult {
  stewSegmentData: StewSegmentData;
}

interface StewSegmentData {
  viewPagesCount: number;
  viewPageItems: Array<BuildSegmentItem>;
}

function useStewSegmentData(
  api: UseStewSegmentDataApi
): UseStewSegmentDataResult {
  const { stewSegmentState, stewConfig, viewPageItemSize } = api;
  const { searchedAndSortedViewItems } = useMemo(
    () => ({
      searchedAndSortedViewItems:
        stewSegmentState.segmentStatus === "segmentLoaded"
          ? stewSegmentState.segmentViewsMap[stewSegmentState.segmentViewKey]
              .reduce<Array<BuildSegmentItem>>(
                (searchedAndSortedViewItemsResult, someSegmentItemIndex) => {
                  const currentSegmentViewItem =
                    stewSegmentState.segmentDataset[someSegmentItemIndex];
                  if (
                    currentSegmentViewItem.__segment_item_search_space.includes(
                      stewSegmentState.viewSearchQuery
                    )
                  ) {
                    searchedAndSortedViewItemsResult.push(
                      currentSegmentViewItem
                    );
                  }
                  return searchedAndSortedViewItemsResult;
                },
                []
              )
              .sort(
                stewSegmentState.segmentModule.segmentSortOptions[
                  stewConfig.stewSegments[stewSegmentState.segmentKey]
                    .segmentSortOptions[stewSegmentState.segmentSortOptionKey]
                    .sortOptionIndex
                ].getSortOrder
              )
          : [],
    }),
    [
      stewSegmentState.segmentKey,
      stewSegmentState.segmentStatus,
      stewSegmentState.segmentViewKey,
      stewSegmentState.viewSearchQuery,
      stewSegmentState.segmentSortOptionKey,
    ]
  );
  const { viewPageItems, viewPagesCount } = useMemo(() => {
    const viewPagesCountResult =
      Math.ceil(searchedAndSortedViewItems.length / viewPageItemSize) || 1;
    const pageIndexStart = viewPageItemSize * stewSegmentState.viewPageIndex;
    const viewPageItemsResult = searchedAndSortedViewItems.slice(
      pageIndexStart,
      pageIndexStart + viewPageItemSize
    );
    return {
      viewPagesCount: viewPagesCountResult,
      viewPageItems: viewPageItemsResult,
    };
  }, [searchedAndSortedViewItems, stewSegmentState.viewPageIndex]);
  return {
    stewSegmentData: {
      viewPageItems,
      viewPagesCount,
    },
  };
}

interface UseStewSegmentUrlApi {
  stewSegmentState: StewSegmentState;
}

function useStewSegmentUrl(api: UseStewSegmentUrlApi) {
  const { stewSegmentState } = api;
  useEffect(() => {
    const nextUrlSearchParams = new URLSearchParams();
    nextUrlSearchParams.set("view", `${stewSegmentState.segmentViewKey}`);
    nextUrlSearchParams.set("sort", `${stewSegmentState.segmentSortOptionKey}`);
    if (stewSegmentState.viewSearchQuery.length > 0) {
      nextUrlSearchParams.set("search", stewSegmentState.viewSearchQuery);
    }
    window.history.replaceState(
      null,
      "noop",
      `/${stewSegmentState.segmentKey}?${nextUrlSearchParams.toString()}`
    );
  }, [
    stewSegmentState.segmentKey,
    stewSegmentState.segmentViewKey,
    stewSegmentState.segmentSortOptionKey,
    stewSegmentState.viewSearchQuery,
  ]);
}
