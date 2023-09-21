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
import { SegmentViewState } from "./SegmentViewState.ts";
import {
  FetchSegmentComponentsResult,
  fetchSegmentComponents,
} from "./fetchSegmentComponents.ts";

export interface UseSegmentViewApi
  extends Pick<
    StewAppProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {}

export interface UseSegmentViewResult
  extends Pick<UseSegmentViewMutationsResult, "segmentViewMutations">,
    Pick<UseSegmentViewDataResult, "segmentViewData"> {
  segmentViewState: SegmentViewState;
}

export function useSegmentView(api: UseSegmentViewApi): UseSegmentViewResult {
  const { initialSegmentViewState, stewConfig, stewResourceMap } = api;
  const [segmentViewState, setSegmentViewState] = useState<SegmentViewState>(
    initialSegmentViewState
  );
  const { segmentViewMutations } = useSegmentViewMutations({
    stewConfig,
    setSegmentViewState,
  });
  const { segmentViewData } = useSegmentViewData({
    stewConfig,
    segmentViewState,
    viewPageItemSize: 6,
  });
  useSegmentComponents({
    stewResourceMap,
    segmentViewState,
    updateSegmentComponents: segmentViewMutations.updateSegmentComponents,
  });
  useSegmentViewUrl({
    segmentViewState,
  });
  return {
    segmentViewState,
    segmentViewMutations,
    segmentViewData,
  };
}

interface UseSegmentViewMutationsApi
  extends Pick<UseSegmentViewApi, "stewConfig"> {
  setSegmentViewState: StateUpdater<SegmentViewState>;
}

interface UseSegmentViewMutationsResult {
  segmentViewMutations: SegmentViewMutations;
}

export interface SegmentViewMutations {
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

function useSegmentViewMutations(
  api: UseSegmentViewMutationsApi
): UseSegmentViewMutationsResult {
  const { stewConfig, setSegmentViewState } = api;
  const segmentViewMutations = useMemo<SegmentViewMutations>(
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
    segmentViewMutations,
  };
}

interface UseSegmentComponentsApi
  extends Pick<UseSegmentViewApi, "stewResourceMap">,
    Pick<SegmentViewMutations, "updateSegmentComponents"> {
  segmentViewState: SegmentViewState;
}

function useSegmentComponents(api: UseSegmentComponentsApi) {
  const { segmentViewState, stewResourceMap, updateSegmentComponents } = api;
  const segmentSwitchCountRef = useRef(0);
  useEffect(() => {
    if (segmentViewState.segmentStatus === "loadingSegment") {
      segmentSwitchCountRef.current += 1;
      const correspondingSwitchCount = segmentSwitchCountRef.current;
      fetchSegmentComponents({
        stewResourceMap,
        someSegmentKey: segmentViewState.segmentKey,
      }).then((nextSegmentComponents) => {
        // guard against updating stewState with stale data
        if (correspondingSwitchCount === segmentSwitchCountRef.current) {
          updateSegmentComponents(nextSegmentComponents);
        }
      });
    }
  }, [segmentViewState.segmentKey]);
}

interface UseSegmentViewDataApi extends Pick<UseSegmentViewApi, "stewConfig"> {
  viewPageItemSize: number;
  segmentViewState: SegmentViewState;
}

interface UseSegmentViewDataResult {
  segmentViewData: SegmentViewData;
}

interface SegmentViewData {
  viewPagesCount: number;
  viewPageItems: Array<BuildSegmentItem>;
}

function useSegmentViewData(
  api: UseSegmentViewDataApi
): UseSegmentViewDataResult {
  const { segmentViewState, stewConfig, viewPageItemSize } = api;
  const { searchedAndSortedViewItems } = useMemo(
    () => ({
      searchedAndSortedViewItems:
        segmentViewState.segmentStatus === "segmentLoaded"
          ? segmentViewState.segmentViewsMap[segmentViewState.segmentViewKey]
              .reduce<Array<BuildSegmentItem>>(
                (searchedAndSortedViewItemsResult, someSegmentItemIndex) => {
                  const currentSegmentViewItem =
                    segmentViewState.segmentDataset[someSegmentItemIndex];
                  if (
                    currentSegmentViewItem.__segment_item_search_space.includes(
                      segmentViewState.viewSearchQuery
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
                segmentViewState.segmentModule.segmentSortOptions[
                  stewConfig.stewSegments[segmentViewState.segmentKey]
                    .segmentSortOptions[segmentViewState.segmentSortOptionKey]
                    .sortOptionIndex
                ].getSortOrder
              )
          : [],
    }),
    [
      segmentViewState.segmentKey,
      segmentViewState.segmentStatus,
      segmentViewState.segmentViewKey,
      segmentViewState.viewSearchQuery,
      segmentViewState.segmentSortOptionKey,
    ]
  );
  const { viewPageItems, viewPagesCount } = useMemo(() => {
    const viewPagesCountResult =
      Math.ceil(searchedAndSortedViewItems.length / viewPageItemSize) || 1;
    const pageIndexStart = viewPageItemSize * segmentViewState.viewPageIndex;
    const viewPageItemsResult = searchedAndSortedViewItems.slice(
      pageIndexStart,
      pageIndexStart + viewPageItemSize
    );
    return {
      viewPagesCount: viewPagesCountResult,
      viewPageItems: viewPageItemsResult,
    };
  }, [searchedAndSortedViewItems, segmentViewState.viewPageIndex]);
  return {
    segmentViewData: {
      viewPageItems,
      viewPagesCount,
    },
  };
}

interface UseSegmentViewUrlApi {
  segmentViewState: SegmentViewState;
}

function useSegmentViewUrl(api: UseSegmentViewUrlApi) {
  const { segmentViewState } = api;
  useEffect(() => {
    const nextUrlSearchParams = new URLSearchParams();
    nextUrlSearchParams.set("sort", `${segmentViewState.segmentSortOptionKey}`);
    if (segmentViewState.viewSearchQuery.length > 0) {
      nextUrlSearchParams.set("search", segmentViewState.viewSearchQuery);
    }
    window.history.replaceState(
      null,
      "noop",
      `/${segmentViewState.segmentKey}/${
        segmentViewState.segmentViewKey
      }?${nextUrlSearchParams.toString()}`
    );
  }, [
    segmentViewState.segmentKey,
    segmentViewState.segmentViewKey,
    segmentViewState.segmentSortOptionKey,
    segmentViewState.viewSearchQuery,
  ]);
}
