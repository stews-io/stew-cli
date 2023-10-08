import { SegmentModule } from "stew/config/mod.ts";
import { MusicItem } from "./MusicItem.ts";
import { MusicItemDisplay } from "./MusicItemDisplay.tsx";

export default getMusicModule();

function getMusicModule(): SegmentModule<MusicItem> {
  return {
    SegmentItemDisplay: MusicItemDisplay,
    segmentSortOptions: [
      {
        sortOptionKey: "musicTitleAsc",
        sortOptionLabel: "title: a → z",
        getSortOrder: (musicItemA, musicItemB) =>
          musicItemA.musicTitle.localeCompare(musicItemB.musicTitle),
      },
      {
        sortOptionKey: "musicTitleDesc",
        sortOptionLabel: "title: z → a",
        getSortOrder: (musicItemA, musicItemB) =>
          musicItemB.musicTitle.localeCompare(musicItemA.musicTitle),
      },
      {
        sortOptionKey: "musicArtistAsc",
        sortOptionLabel: "artist: a → z",
        getSortOrder: (musicItemA, musicItemB) =>
          musicItemA.musicArtist[0].localeCompare(musicItemB.musicArtist[0]),
      },
      {
        sortOptionKey: "musicArtistDesc",
        sortOptionLabel: "artist: z → a",
        getSortOrder: (musicItemA, musicItemB) =>
          musicItemB.musicArtist[0].localeCompare(musicItemA.musicArtist[0]),
      },
      {
        sortOptionKey: "musicYearAsc",
        sortOptionLabel: "year: 0 → 9",
        getSortOrder: (musicItemA, musicItemB) =>
          musicItemA.musicYear - musicItemB.musicYear,
      },
      {
        sortOptionKey: "musicYearDesc",
        sortOptionLabel: "year: 9 → 0",
        getSortOrder: (musicItemA, musicItemB) =>
          musicItemB.musicYear - musicItemA.musicYear,
      },
    ],
    getSegmentItemSearchString: (someMusicItem: MusicItem) =>
      `${someMusicItem.musicTitle},${someMusicItem.musicArtist.join(
        ","
      )},${someMusicItem.musicTags.join(",")},${
        someMusicItem.musicYear
      },${`${someMusicItem.recordingContext.join("/")} ${
        someMusicItem.sourceType === "collection"
          ? someMusicItem.collectionType
          : someMusicItem.sourceType
      }`}`,
  };
}
