import { SegmentDataset } from "stew-library/config";
import { SpotItem } from "./SpotItem.ts";

export default [
  { itemId: 0, spotName: "ice cream #1" },
  { itemId: 1, spotName: "bagels r' us" },
] satisfies SegmentDataset<SpotItem>;
