import { SegmentItem } from "stew/config/mod.ts";
import { ArrayOfAtLeastOne } from "stew/utilities/mod.ts";

export interface LinkItem extends SegmentItem {
  linkTitle: string;
  linkHref: string;
  linkAuthor: ArrayOfAtLeastOne<string>;
  linkTags: ArrayOfAtLeastOne<string>;
  secondaryLinks: Array<{
    linkLabel: string;
    linkHref: string;
  }>;
}
