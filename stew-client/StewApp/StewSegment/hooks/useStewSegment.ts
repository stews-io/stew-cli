import {
  ComponentProps,
  FunctionComponent,
  JSX,
} from "../../../../stew-library/deps/preact/mod.ts";
import {
  StateUpdater,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../../../stew-library/deps/preact/hooks.ts";
import { BuildSegmentItem } from "../../../../stew-library/config/mod.ts";
import {
  findMapItem,
  throwInvalidPathError,
} from "../../../../stew-library/utilities/mod.ts";
import {
  FetchSegmentComponentsResult,
  fetchSegmentComponents,
} from "../../fetchSegmentComponents.ts";
import { StewSegmentProps } from "../StewSegment.tsx";
import {
  EmptyViewSegmentContent,
  ErrorLoadingSegmentContent,
  LoadingSegmentContent,
  ViewPageSegmentContent,
  ViewPageSegmentContentProps,
} from "../components/SegmentContent.tsx";
import { StewSegmentState } from "../types/StewSegmentState.ts";

export interface UseStewSegmentApi
  extends Pick<
    StewSegmentProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {
  // not necessary in a mechanical sense, but improves visibility of mutations
  routeUpdateSegmentComponentsMutation: (
    api: GetUpdateSegmentComponentsMutationApi
  ) => StewSegmentMutations["updateSegmentComponents"];
  routeGotoViewPageMutations: (
    api: GetViewPageSegmentContentMutationPropsApi
  ) => Pick<
    ViewPageSegmentContentProps,
    "gotoPreviousViewPage" | "gotoNextViewPage"
  >;
}

interface GetUpdateSegmentComponentsMutationApi
  extends Pick<UseStewSegmentMutationsResult, "stewSegmentMutations"> {}

interface GetViewPageSegmentContentMutationPropsApi
  extends Pick<UseStewSegmentMutationsResult, "stewSegmentMutations"> {}

export interface UseStewSegmentResult
  extends Pick<UseStewSegmentMutationsResult, "stewSegmentMutations">,
    Pick<UseStewSegmentDataResult, "stewSegmentData"> {
  stewSegmentState: StewSegmentState;
}

export function useStewSegment(api: UseStewSegmentApi): UseStewSegmentResult {
  const {
    initialSegmentViewState,
    stewConfig,
    stewResourceMap,
    routeGotoViewPageMutations,
    routeUpdateSegmentComponentsMutation,
  } = api;
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
    ...routeGotoViewPageMutations({
      stewSegmentMutations,
    }),
  });
  useStewSegmentComponents({
    stewResourceMap,
    stewSegmentState,
    updateSegmentComponents: routeUpdateSegmentComponentsMutation({
      stewSegmentMutations,
    }),
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
          viewPageIndex: currentSegmentViewState.viewPageIndex + 1,
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
      Promise.all([
        fetchSegmentComponents({
          stewResourceMap,
          someSegmentKey: stewSegmentState.segmentKey,
        }),
        new Promise<void>((resolveMinimumLoadingDisplayPromise) => {
          setTimeout(() => {
            resolveMinimumLoadingDisplayPromise();
          }, 350);
        }),
      ]).then(([nextSegmentComponents]) => {
        // guard against updating stewState with stale data
        if (correspondingSwitchCount === segmentSwitchCountRef.current) {
          updateSegmentComponents(nextSegmentComponents);
        }
      });
    }
  }, [stewSegmentState.segmentKey]);
}

interface UseStewSegmentDataApi
  extends Pick<UseStewSegmentApi, "stewConfig">,
    Pick<StewSegmentMutations, "gotoPreviousViewPage" | "gotoNextViewPage"> {
  viewPageItemSize: number;
  stewSegmentState: StewSegmentState;
}

interface UseStewSegmentDataResult {
  stewSegmentData: StewSegmentData<FunctionComponent>;
}

interface StewSegmentData<
  SegmentContentComponent extends FunctionComponent<JSX.IntrinsicAttributes> = FunctionComponent<JSX.IntrinsicAttributes>
> {
  SegmentContent: SegmentContentComponent;
  segmentContentProps: ComponentProps<SegmentContentComponent>;
}

type InternalStewSegmentData =
  | ViewPageSegmentContentData
  | EmptyViewSegmentContentData
  | LoadingSegmentContentData
  | ErrorLoadingSegmentContentData;

interface ViewPageSegmentContentData
  extends InternalStewSegmentDataBase<typeof ViewPageSegmentContent> {}

interface EmptyViewSegmentContentData
  extends InternalStewSegmentDataBase<typeof EmptyViewSegmentContent> {}

interface LoadingSegmentContentData
  extends InternalStewSegmentDataBase<typeof LoadingSegmentContent> {}

interface ErrorLoadingSegmentContentData
  extends InternalStewSegmentDataBase<typeof ErrorLoadingSegmentContent> {}

interface InternalStewSegmentDataBase<
  SegmentContentComponent extends FunctionComponent<any>
> {
  SegmentContent: SegmentContentComponent;
  segmentContentProps: ComponentProps<SegmentContentComponent>;
}

function useStewSegmentData(
  api: UseStewSegmentDataApi
): UseStewSegmentDataResult {
  const {
    stewSegmentState,
    stewConfig,
    viewPageItemSize,
    gotoPreviousViewPage,
    gotoNextViewPage,
  } = api;
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
  const { stewSegmentData } = useMemo(() => {
    const stewSegmentDataResult: InternalStewSegmentData =
      stewSegmentState.segmentStatus === "segmentLoaded" &&
      viewPageItems.length === 0
        ? {
            SegmentContent: EmptyViewSegmentContent,
            segmentContentProps: {},
          }
        : stewSegmentState.segmentStatus === "segmentLoaded"
        ? {
            SegmentContent: ViewPageSegmentContent,
            segmentContentProps: {
              stewSegmentState,
              gotoPreviousViewPage,
              gotoNextViewPage,
              viewPageItems,
              viewPagesCount,
            },
          }
        : stewSegmentState.segmentStatus === "loadingSegment"
        ? {
            SegmentContent: LoadingSegmentContent,
            segmentContentProps: {},
          }
        : stewSegmentState.segmentStatus === "errorLoadingSegment"
        ? {
            SegmentContent: ErrorLoadingSegmentContent,
            segmentContentProps: {},
          }
        : throwInvalidPathError("useStewSegmentData.stewSegmentData");
    return {
      stewSegmentData: stewSegmentDataResult as StewSegmentData,
    };
  }, [stewSegmentState, viewPageItems, viewPagesCount]);
  return {
    stewSegmentData,
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
