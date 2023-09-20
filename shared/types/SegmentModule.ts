import { JSX } from "../deps/preact/mod.ts";
import { SegmentItem } from "./SegmentDataset.ts";

export interface SegmentModule<SomeSegmentItem extends SegmentItem> {
  segmentSortOptions: Array<SegmentSortOption<SomeSegmentItem>>;
  getSegmentItemSearchString: (someSegmentItem: SomeSegmentItem) => string;
  SegmentItemDisplay: (
    props: SegmentItemDisplayProps<SomeSegmentItem>
  ) => JSX.Element;
}

export interface SegmentSortOption<SomeSegmentItem extends SegmentItem> {
  sortOptionKey: string;
  sortOptionLabel: string;
  sortSegmentItems: Parameters<Array<SomeSegmentItem>["sort"]>[0];
}

export interface SegmentItemDisplayProps<SomeSegmentItem extends SegmentItem> {
  someSegmentItem: SomeSegmentItem;
}
