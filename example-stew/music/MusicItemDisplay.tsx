import { SegmentItemDisplayProps } from "../../source/shared/types/SegmentModule.ts";
import { MusicItem } from "./MusicItem.ts";
// @deno-types="../declaration.d.ts"
import cssModule from "./MusicItemDisplay.module.css";

export interface MusicItemDisplayProps
  extends SegmentItemDisplayProps<MusicItem> {}

export function MusicItemDisplay(props: MusicItemDisplayProps) {
  const { someSegmentItem } = props;
  console.log(cssModule);
  return (
    <div className={cssModule.fooClass}>
      <div className={cssModule.bazClass}>{someSegmentItem.musicTitle}</div>
    </div>
  );
}
