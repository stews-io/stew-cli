import {
  SegmentItem,
  SegmentModule,
} from "../../../source/shared/data/StewSegmentModule.ts";

export default {
  segmentItems: [
    { itemId: 0, spotName: "ice cream #1" },
    { itemId: 1, spotName: "bagels r' us" },
  ],
  segmentSortOptions: [
    {
      sortOptionKey: "spotNameAsc",
      sortOptionLabel: "name: a → z",
      compareSortItems: (stewItemA, stewItemB) =>
        stewItemA.spotName.localeCompare(stewItemB.spotName),
    },
    {
      sortOptionKey: "spotNameDesc",
      sortOptionLabel: "name: z → a",
      compareSortItems: (stewItemA, stewItemB) =>
        stewItemB.spotName.localeCompare(stewItemA.spotName),
    },
  ],
  getSegmentItemSearchString: (someStewItem) => someStewItem.spotName,
  SegmentItemDisplay: (props) => {
    const { someSegmentItem } = props;
    return <div>{someSegmentItem.spotName}</div>;
  },
} satisfies SegmentModule<SpotItem>;

interface SpotItem extends SegmentItem {
  spotName: string;
}
