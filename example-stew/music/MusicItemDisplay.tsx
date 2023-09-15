import { SegmentItemDisplayProps } from "../../shared/types/SegmentModule.ts";
import { MusicItem } from "./MusicItem.ts";
// @deno-types="CssModule"
import cssModule from "./MusicItemDisplay.module.css";

export interface MusicItemDisplayProps
  extends SegmentItemDisplayProps<MusicItem> {}

export function MusicItemDisplay(props: MusicItemDisplayProps) {
  const { someSegmentItem } = props;
  return (
    <div className={cssModule.fooClass}>
      <div className={cssModule.bazClass}>{someSegmentItem.musicTitle}</div>
    </div>
  );
}
