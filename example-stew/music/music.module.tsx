import { SegmentModule } from "../../source/shared/types/SegmentModule.ts";
import { MusicItem } from "./MusicItem.ts";

export default {
  segmentSortOptions: [
    {
      sortOptionKey: "musicTitleAsc",
      sortOptionLabel: "title: a → z",
      compareSortItems: (segmentItemA, segmentItemB) =>
        segmentItemA.musicTitle.localeCompare(segmentItemB.musicTitle),
    },
    {
      sortOptionKey: "musicTitleDesc",
      sortOptionLabel: "title: z → a",
      compareSortItems: (segmentItemA, segmentItemB) =>
        segmentItemB.musicTitle.localeCompare(segmentItemA.musicTitle),
    },
  ],
  getSegmentItemSearchString: (someSegmentItem) => someSegmentItem.musicTitle,
  SegmentItemDisplay: (props) => {
    const { someSegmentItem } = props;
    return <div>{someSegmentItem.musicTitle}</div>;
  },
} satisfies SegmentModule<MusicItem>;
