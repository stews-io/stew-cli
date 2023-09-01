import { JSX } from "npm/preact";
import * as Zod from "deno/x/zod/mod.ts";

export interface CuratorStewConfig {
  ItemDisplay: (props: { someRandomNumber: number }) => JSX.Element;
}

export const CuratorStewConfigSchema = Zod.object({
  ItemDisplay: Zod.function()
    .args(
      Zod.object({
        someRandomNumber: Zod.number(),
      })
    )
    .returns(Zod.any()),
});
