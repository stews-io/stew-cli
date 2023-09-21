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
import { StewState } from "./StewState.ts";
import {
  FetchSegmentComponentsResult,
  fetchSegmentComponents,
} from "./fetchSegmentComponents.ts";
import { findMapItem } from "./findMapItem.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialStewState: StewState;
}

export function StewApp(props: StewAppProps) {
  const { initialStewState, stewConfig, stewResourceMap } = props;
  const { stewState, setStewState } = useStewState({
    initialStewState,
    stewResourceMap,
    updateSegmentComponents: ([
      nextSegmentDataset,
      nextSegmentModule,
      nextSegmentViewsMap,
      nextSegmentCss,
    ]) => {
      setStewState((currentStewState) => ({
        ...currentStewState,
        segmentStatus: "segmentLoaded",
        segmentDataset: nextSegmentDataset,
        segmentModule: nextSegmentModule,
        segmentViewsMap: nextSegmentViewsMap,
        segmentCss: nextSegmentCss,
      }));
    },
  });
  const { segmentView } = useSegmentView({
    stewConfig,
    stewState,
    viewPageItemSize: 6,
  });
  return (
    <SegmentViewPage
      stewConfig={stewConfig}
      stewState={stewState}
      segmentView={segmentView}
      selectStewSegment={(nextSegmentKey) => {
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
        setStewState({
          segmentStatus: "loadingSegment",
          viewPageIndex: 0,
          viewSearchQuery: "",
          segmentKey: nextSegmentKey,
          segmentViewKey: defaultSegmentViewConfig.viewKey,
          segmentSortOptionKey: defaultSegmentSortOptionConfig.sortOptionKey,
        });
      }}
      selectSegmentView={(nextSegmentViewKey) => {
        setStewState((currentStewState) => ({
          ...currentStewState,
          viewPageIndex: 0,
          segmentViewKey: nextSegmentViewKey,
        }));
      }}
      selectSegmentSortOption={(nextSegmentSortOptionKey) => {
        setStewState((currentStewState) => ({
          ...currentStewState,
          viewPageIndex: 0,
          segmentSortOptionKey: nextSegmentSortOptionKey,
        }));
      }}
      updateSegmentViewSearch={(nextViewSearchQuery) => {
        setStewState((currentStewState) => ({
          ...currentStewState,
          viewPageIndex: 0,
          viewSearchQuery: nextViewSearchQuery,
        }));
      }}
      clearSegmentViewSearch={() => {
        setStewState((currentStewState) => ({
          ...currentStewState,
          viewPageIndex: 0,
          viewSearchQuery: "",
        }));
      }}
      gotoPreviousViewPage={() => {
        setStewState((currentStewState) => ({
          ...currentStewState,
          viewPageIndex: currentStewState.viewPageIndex - 1,
        }));
      }}
      gotoNextViewPage={() => {
        setStewState((currentStewState) => ({
          ...currentStewState,
          viewPageIndex: currentStewState.viewPageIndex + 1,
        }));
      }}
    />
  );
}

interface UseStewStateApi
  extends Pick<StewAppProps, "initialStewState" | "stewResourceMap"> {
  updateSegmentComponents: (
    nextSegmentComponents: FetchSegmentComponentsResult
  ) => void;
}

interface UseStewStateResult {
  stewState: StewState;
  setStewState: StateUpdater<StewState>;
}

function useStewState(api: UseStewStateApi): UseStewStateResult {
  const { initialStewState, stewResourceMap, updateSegmentComponents } = api;
  const segmentSwitchCountRef = useRef(0);
  const [stewState, setStewState] = useState<StewState>(initialStewState);
  useEffect(() => {
    const nextUrlSearchParams = new URLSearchParams();
    nextUrlSearchParams.set("sort", `${stewState.segmentSortOptionKey}`);
    if (stewState.viewSearchQuery.length > 0) {
      nextUrlSearchParams.set("search", stewState.viewSearchQuery);
    }
    window.history.replaceState(
      null,
      "noop",
      `/${stewState.segmentKey}/${
        stewState.segmentViewKey
      }?${nextUrlSearchParams.toString()}`
    );
  }, [
    stewState.segmentKey,
    stewState.segmentViewKey,
    stewState.segmentSortOptionKey,
    stewState.viewSearchQuery,
  ]);
  useEffect(() => {
    if (stewState.segmentStatus === "loadingSegment") {
      segmentSwitchCountRef.current += 1;
      const correspondingSwitchCount = segmentSwitchCountRef.current;
      fetchSegmentComponents({
        stewResourceMap,
        someSegmentKey: stewState.segmentKey,
      }).then((nextSegmentComponents) => {
        // guard against updating stewState with stale data
        if (correspondingSwitchCount === segmentSwitchCountRef.current) {
          updateSegmentComponents(nextSegmentComponents);
        }
      });
    }
  }, [stewState.segmentKey]);
  return { stewState, setStewState };
}

interface UseSegmentViewApi
  extends Pick<StewAppProps, "stewConfig">,
    Pick<UseStewStateResult, "stewState"> {
  viewPageItemSize: number;
}

interface UseSegmentViewResult {
  segmentView: {
    pagesCount: number;
    pageItems: Array<BuildSegmentItem>;
  };
}

function useSegmentView(api: UseSegmentViewApi): UseSegmentViewResult {
  const { stewState, stewConfig, viewPageItemSize } = api;
  const { searchedAndSortedViewItems } = useMemo(
    () => ({
      searchedAndSortedViewItems:
        stewState.segmentStatus === "segmentLoaded"
          ? stewState.segmentViewsMap[stewState.segmentViewKey]
              .reduce<Array<BuildSegmentItem>>(
                (searchedAndSortedViewItemsResult, someSegmentItemIndex) => {
                  const currentSegmentViewItem =
                    stewState.segmentDataset[someSegmentItemIndex];
                  if (
                    currentSegmentViewItem.__segment_item_search_space.includes(
                      stewState.viewSearchQuery
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
                stewState.segmentModule.segmentSortOptions[
                  stewConfig.stewSegments[stewState.segmentKey]
                    .segmentSortOptions[stewState.segmentSortOptionKey]
                    .sortOptionIndex
                ].getSortOrder
              )
          : [],
    }),
    [
      stewState.segmentKey,
      stewState.segmentStatus,
      stewState.segmentViewKey,
      stewState.viewSearchQuery,
      stewState.segmentSortOptionKey,
    ]
  );
  const { viewPageItems, viewPagesCount } = useMemo(() => {
    const viewPagesCountResult =
      Math.ceil(searchedAndSortedViewItems.length / viewPageItemSize) || 1;
    const pageIndexStart = viewPageItemSize * stewState.viewPageIndex;
    const viewPageItemsResult = searchedAndSortedViewItems.slice(
      pageIndexStart,
      pageIndexStart + viewPageItemSize
    );
    return {
      viewPagesCount: viewPagesCountResult,
      viewPageItems: viewPageItemsResult,
    };
  }, [searchedAndSortedViewItems, stewState.viewPageIndex]);
  return {
    segmentView: {
      pageItems: viewPageItems,
      pagesCount: viewPagesCount,
    },
  };
}

interface SegmentViewPageProps
  extends Pick<StewAppProps, "stewConfig">,
    Pick<UseStewStateResult, "stewState">,
    Pick<UseSegmentViewResult, "segmentView"> {
  selectStewSegment: (nextSegmentKey: string) => void;
  selectSegmentView: (nextSegmentViewKey: string) => void;
  selectSegmentSortOption: (nextSegmentSortOptionKey: string) => void;
  updateSegmentViewSearch: (nextViewSearchQuery: string) => void;
  clearSegmentViewSearch: () => void;
  gotoPreviousViewPage: () => void;
  gotoNextViewPage: () => void;
}

function SegmentViewPage(props: SegmentViewPageProps) {
  const {
    stewConfig,
    stewState,
    selectStewSegment,
    selectSegmentView,
    selectSegmentSortOption,
    updateSegmentViewSearch,
    clearSegmentViewSearch,
    gotoPreviousViewPage,
    gotoNextViewPage,
    segmentView,
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
                  stewState.segmentKey === someSegmentConfig.segmentKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (stewState.segmentKey !== someSegmentConfig.segmentKey) {
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
          stewConfig.stewSegments[stewState.segmentKey].segmentViews
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
                  stewState.segmentViewKey === someViewConfig.viewKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (stewState.segmentViewKey !== someViewConfig.viewKey) {
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
          stewConfig.stewSegments[stewState.segmentKey].segmentSortOptions
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
                  stewState.segmentSortOptionKey ===
                  someSortOptionConfig.sortOptionKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  stewState.segmentSortOptionKey !==
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
          value={stewState.viewSearchQuery}
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
            if (stewState.viewPageIndex > 0) {
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
            if (stewState.viewPageIndex < segmentView.pagesCount - 1) {
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
        >{`${stewState.viewPageIndex + 1} / ${segmentView.pagesCount}`}</div>
      </div>
      {stewState.segmentStatus === "segmentLoaded" ? (
        <Fragment>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 8,
              paddingTop: 12,
            }}
          >
            {segmentView.pageItems.map((someViewItem) => (
              <div style={{ paddingBottom: 8 }}>
                <stewState.segmentModule.SegmentItemDisplay
                  someSegmentItem={someViewItem}
                />
              </div>
            ))}
          </div>
          <style>{stewState.segmentCss}</style>
        </Fragment>
      ) : null}
    </div>
  );
}
