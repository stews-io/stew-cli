import {
  StateUpdater,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../../shared/deps/preact/hooks.ts";
import { Fragment } from "../../../shared/deps/preact/mod.ts";
import { throwInvalidPathError } from "../../../shared/general/throwInvalidPathError.ts";
import { BuildSegmentItem } from "../../../shared/types/SegmentDataset.ts";
import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";
import { SegmentViewState } from "./SegmentViewState.ts";
import {
  FetchSegmentComponentsResult,
  fetchSegmentComponents,
} from "./fetchSegmentComponents.ts";
import { findMapItem } from "./findMapItem.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialSegmentViewState: SegmentViewState;
}

export function StewApp(props: StewAppProps) {
  const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
  const { segmentViewState, segmentViewData, segmentViewMutations } =
    useSegmentView({
      stewConfig,
      stewResourceMap,
      initialSegmentViewState,
    });
  return (
    <SegmentViewDisplay
      stewConfig={stewConfig}
      segmentViewState={segmentViewState}
      segmentViewData={segmentViewData}
      selectStewSegment={segmentViewMutations.selectStewSegment}
      selectSegmentView={segmentViewMutations.selectSegmentView}
      selectSegmentSortOption={segmentViewMutations.selectSegmentSortOption}
      updateSegmentViewSearch={segmentViewMutations.updateSegmentViewSearch}
      clearSegmentViewSearch={segmentViewMutations.clearSegmentViewSearch}
      gotoPreviousViewPage={segmentViewMutations.gotoPreviousViewPage}
      gotoNextViewPage={segmentViewMutations.gotoNextViewPage}
    />
  );
}

interface UseSegmentViewApi
  extends Pick<
    StewAppProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {}

interface UseSegmentViewResult
  extends Pick<UseSegmentViewMutationsResult, "segmentViewMutations">,
    Pick<UseSegmentViewDataResult, "segmentViewData"> {
  segmentViewState: SegmentViewState;
}

function useSegmentView(api: UseSegmentViewApi): UseSegmentViewResult {
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

interface SegmentViewMutations {
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

interface SegmentViewDisplayProps
  extends Pick<StewAppProps, "stewConfig">,
    Pick<UseSegmentViewResult, "segmentViewState" | "segmentViewData">,
    Pick<
      SegmentViewMutations,
      | "selectStewSegment"
      | "selectSegmentView"
      | "selectSegmentSortOption"
      | "updateSegmentViewSearch"
      | "clearSegmentViewSearch"
      | "gotoPreviousViewPage"
      | "gotoNextViewPage"
    > {}

function SegmentViewDisplay(props: SegmentViewDisplayProps) {
  const {
    stewConfig,
    segmentViewState,
    selectStewSegment,
    selectSegmentView,
    selectSegmentSortOption,
    updateSegmentViewSearch,
    clearSegmentViewSearch,
    gotoPreviousViewPage,
    gotoNextViewPage,
    segmentViewData,
  } = props;
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(stewConfig.stewSegments)
          .sort(
            (segmentA, segmentB) =>
              segmentA.segmentIndex - segmentB.segmentIndex
          )
          .map((someSegmentConfig) => (
            <div
              style={{
                padding: 8,
                color: "purple",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration:
                  segmentViewState.segmentKey === someSegmentConfig.segmentKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  segmentViewState.segmentKey !== someSegmentConfig.segmentKey
                ) {
                  selectStewSegment(someSegmentConfig.segmentKey);
                }
              }}
            >
              {someSegmentConfig.segmentLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(
          stewConfig.stewSegments[segmentViewState.segmentKey].segmentViews
        )
          .sort((viewA, viewB) => viewA.viewIndex - viewB.viewIndex)
          .map((someViewConfig) => (
            <div
              style={{
                padding: 8,
                color: "blue",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration:
                  segmentViewState.segmentViewKey === someViewConfig.viewKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  segmentViewState.segmentViewKey !== someViewConfig.viewKey
                ) {
                  selectSegmentView(someViewConfig.viewKey);
                }
              }}
            >
              {someViewConfig.viewLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(
          stewConfig.stewSegments[segmentViewState.segmentKey]
            .segmentSortOptions
        )
          .sort(
            (sortOptionA, sortOptionB) =>
              sortOptionA.sortOptionIndex - sortOptionB.sortOptionIndex
          )
          .map((someSortOptionConfig) => (
            <div
              style={{
                padding: 8,
                color: "green",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration:
                  segmentViewState.segmentSortOptionKey ===
                  someSortOptionConfig.sortOptionKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  segmentViewState.segmentSortOptionKey !==
                  someSortOptionConfig.sortOptionKey
                ) {
                  selectSegmentSortOption(someSortOptionConfig.sortOptionKey);
                }
              }}
            >
              {someSortOptionConfig.sortOptionLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row", padding: 8 }}>
        <input
          value={segmentViewState.viewSearchQuery}
          onInput={(someInputEvent) => {
            updateSegmentViewSearch(someInputEvent.currentTarget.value);
          }}
        />
        <div
          style={{
            color: "red",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => {
            clearSegmentViewSearch();
          }}
        >
          clear
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            padding: 8,
            color: "orange",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => {
            if (segmentViewState.viewPageIndex > 0) {
              gotoPreviousViewPage();
            }
          }}
        >
          prev
        </div>
        <div
          style={{
            padding: 8,
            color: "orange",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => {
            if (
              segmentViewState.viewPageIndex <
              segmentViewData.viewPagesCount - 1
            ) {
              gotoNextViewPage();
            }
          }}
        >
          next
        </div>
        <div
          style={{
            padding: 8,
            color: "black",
            cursor: "pointer",
            fontWeight: 700,
            fontStyle: "italic",
          }}
        >{`${segmentViewState.viewPageIndex + 1} / ${
          segmentViewData.viewPagesCount
        }`}</div>
      </div>
      {segmentViewState.segmentStatus === "segmentLoaded" ? (
        <Fragment>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 8,
              paddingTop: 12,
            }}
          >
            {segmentViewData.viewPageItems.map((someViewItem) => (
              <div style={{ paddingBottom: 8 }}>
                <segmentViewState.segmentModule.SegmentItemDisplay
                  someSegmentItem={someViewItem}
                />
              </div>
            ))}
          </div>
          <style>{segmentViewState.segmentCss}</style>
        </Fragment>
      ) : null}
    </div>
  );
}
