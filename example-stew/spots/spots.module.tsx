import { SegmentModule } from "../../source/shared/types/SegmentModule.ts";
import { SpotItem } from "./SpotItem.ts";

export default {
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
