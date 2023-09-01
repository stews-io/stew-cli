import { JSX } from "npm/preact";
import * as Zod from "deno/x/zod/mod.ts";

export interface CuratorStewConfig<SomeCurationItem extends CurationItem> {
  ItemDisplay: (props: ItemDisplayProps<SomeCurationItem>) => JSX.Element;
}

export interface ItemDisplayProps<SomeCurationItem extends CurationItem> {
  someItem: SomeCurationItem;
}

export interface CurationItem {
  itemId: number;
  [someKey: string]: unknown;
}

export const CuratorStewConfigSchema = Zod.object({
  ItemDisplay: Zod.function()
    .args(
      Zod.object({
        someItem: Zod.object({
          itemId: Zod.number(),
        }).passthrough(),
      })
    )
    // todo: match VNode typing
    .returns(Zod.any()),
});
