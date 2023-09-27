import {
  BuildSegmentItem,
  SegmentDataset,
  SegmentModule,
  SegmentViewsMap,
} from "stew-library/config";

export type StewSegmentState =
  | SegmentLoadedStewState
  | LoadingSegmentStewState
  | ErrorLoadingSegmentStewState;

export interface SegmentLoadedStewState
  extends StewSegmentStateBase<"segmentLoaded"> {
  segmentDataset: SegmentDataset<BuildSegmentItem>;
  segmentModule: SegmentModule<BuildSegmentItem>;
  segmentViewsMap: SegmentViewsMap;
  segmentCss: string;
}

export interface LoadingSegmentStewState
  extends StewSegmentStateBase<"loadingSegment"> {}

export interface ErrorLoadingSegmentStewState
  extends StewSegmentStateBase<"errorLoadingSegment"> {}

interface StewSegmentStateBase<SegmentStatus extends string> {
  segmentStatus: SegmentStatus;
  segmentKey: string;
  segmentSortOptionKey: string;
  segmentViewKey: string;
  viewSearchQuery: string;
  viewPageIndex: number;
}
