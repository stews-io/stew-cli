import { SegmentDataset } from "../../shared/types/SegmentDataset.ts";
import { MusicItem } from "./MusicItem.ts";

export default [
  { itemId: 0, musicTitle: "greatest album ever" },
  { itemId: 1, musicTitle: "ba bang banger" },
] satisfies SegmentDataset<MusicItem>;
