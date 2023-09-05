import {
  StewItem,
  StewSegmentModule,
} from "../../../source/library/data/StewSegmentModule.ts";

export default {
  segmentItems: [
    { itemId: 0, musicTitle: "greatest album ever" },
    { itemId: 1, musicTitle: "ba bang banger" },
  ],
  segmentSortOptions: [
    {
      sortOptionKey: "musicTitleAsc",
      sortOptionLabel: "title: a → z",
      compareSortItems: (stewItemA, stewItemB) =>
        stewItemA.musicTitle.localeCompare(stewItemB.musicTitle),
    },
    {
      sortOptionKey: "musicTitleDesc",
      sortOptionLabel: "title: z → a",
      compareSortItems: (stewItemA, stewItemB) =>
        stewItemB.musicTitle.localeCompare(stewItemA.musicTitle),
    },
  ],
  getSegmentItemSearchString: (someStewItem) => someStewItem.musicTitle,
  SegmentItemDisplay: (props) => {
    const { someStewItem } = props;
    return <div>{someStewItem.musicTitle}</div>;
  },
} satisfies StewSegmentModule<MusicItem>;

interface MusicItem extends StewItem {
  musicTitle: string;
}
