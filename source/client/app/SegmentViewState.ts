import {
  BuildSegmentItem,
  SegmentDataset,
} from "../../../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../../../shared/types/SegmentModule.ts";
import { SegmentViewsMap } from "../../../shared/types/SegmentViewsMap.ts";

export type SegmentViewState =
  | SegmentLoadedStewState
  | LoadingSegmentStewState
  | ErrorLoadingSegmentStewState;

export interface SegmentLoadedStewState
  extends SegmentViewStateBase<"segmentLoaded"> {
  segmentDataset: SegmentDataset<BuildSegmentItem>;
  segmentModule: SegmentModule<BuildSegmentItem>;
  segmentViewsMap: SegmentViewsMap;
  segmentCss: string;
}

export interface LoadingSegmentStewState
  extends SegmentViewStateBase<"loadingSegment"> {}

export interface ErrorLoadingSegmentStewState
  extends SegmentViewStateBase<"errorLoadingSegment"> {}

interface SegmentViewStateBase<SegmentStatus extends string> {
  segmentStatus: SegmentStatus;
  segmentKey: string;
  segmentSortOptionKey: string;
  segmentViewKey: string;
  viewSearchQuery: string;
  viewPageIndex: number;
}
