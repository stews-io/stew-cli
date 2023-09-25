import { SegmentModule } from "../../mod.ts";
import { MusicItem } from "./MusicItem.ts";
import { MusicItemDisplay } from "./MusicItemDisplay.tsx";

export default {
  segmentSortOptions: [
    {
      sortOptionKey: "musicTitleAsc",
      sortOptionLabel: "title: a → z",
      getSortOrder: (segmentItemA, segmentItemB) =>
        segmentItemA.musicTitle.localeCompare(segmentItemB.musicTitle),
    },
    {
      sortOptionKey: "musicTitleDesc",
      sortOptionLabel: "title: z → a",
      getSortOrder: (segmentItemA, segmentItemB) =>
        segmentItemB.musicTitle.localeCompare(segmentItemA.musicTitle),
    },
  ],
  getSegmentItemSearchString: (someSegmentItem) => someSegmentItem.musicTitle,
  SegmentItemDisplay: MusicItemDisplay,
} satisfies SegmentModule<MusicItem>;
