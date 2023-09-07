import { JSX } from "npm/preact";

export interface SegmentModule<SomeSegmentItem extends SegmentItem> {
  segmentItems: Array<SomeSegmentItem>;
  segmentSortOptions: Array<SegmentSortOption<SomeSegmentItem>>;
  getSegmentItemSearchString: (someSegmentItem: SomeSegmentItem) => string;
  SegmentItemDisplay: (
    props: SegmentItemDisplayProps<SomeSegmentItem>
  ) => JSX.Element;
}

export interface SegmentItem {
  itemId: number;
}

export interface SegmentSortOption<SomeSegmentItem extends SegmentItem> {
  sortOptionKey: string;
  sortOptionLabel: string;
  compareSortItems: Parameters<Array<SomeSegmentItem>["sort"]>[0];
}

export interface SegmentItemDisplayProps<SomeSegmentItem extends SegmentItem> {
  someSegmentItem: SomeSegmentItem;
}
