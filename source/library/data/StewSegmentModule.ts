import { JSX } from "npm/preact";

export interface StewSegmentModule<SegmentItem extends StewItem> {
  segmentItems: Array<SegmentItem>;
  segmentSortOptions: Array<StewSortOption<SegmentItem>>;
  getSegmentItemSearchString: (someSegmentItem: SegmentItem) => string;
  SegmentItemDisplay: (props: StewItemDisplayProps<SegmentItem>) => JSX.Element;
}

export interface StewItem {
  itemId: number;
}

export interface StewSortOption<SegmentItem extends StewItem> {
  sortOptionKey: string;
  sortOptionLabel: string;
  compareSortItems: Parameters<Array<SegmentItem>["sort"]>[0];
}

export interface StewItemDisplayProps<SomeStewItem extends StewItem> {
  someStewItem: SomeStewItem;
}
