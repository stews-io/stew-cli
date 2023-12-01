import { ComponentProps, FunctionComponent } from "stew/deps/preact/mod.ts";

const exampleConfig = tupleConfig([
  {
    itemKey: "aaa",
    ItemDisplay: AaaDisplay,
    itemDisplayConfig: {
      aaaThang: 2,
    },
  },
  {
    itemKey: "bbb",
    ItemDisplay: BbbDisplay,
    itemDisplayConfig: {
      bbbThing: "asdf",
      // thang: 3,
    },
    // thang: 3,
  },
]);

const verifiedExampleConfig: VerifyTuple<typeof exampleConfig> = exampleConfig;

interface AaaDisplayConfig {
  aaaThang: number;
}

interface AaaDisplayProps extends ItemDisplayProps<AaaDisplayConfig> {}

function AaaDisplay(props: AaaDisplayProps) {
  return null;
}

interface BbbDisplayConfig {
  bbbThing: string;
}

interface BbbDisplayProps extends ItemDisplayProps<BbbDisplayConfig> {}

function BbbDisplay(props: BbbDisplayProps) {
  return null;
}

function tupleConfig<
  SomeItemKey extends string,
  ThisTupleConfig extends [
    ItemConfig<SomeItemKey, any>,
    ...Array<ItemConfig<SomeItemKey, any>>
  ]
>(thisTupleConfig: ThisTupleConfig) {
  return thisTupleConfig;
}

type VerifyTuple<
  RemainingElements,
  ResultElements extends Array<any> = []
> = RemainingElements extends [
  infer CurrentElement,
  ...infer NextRemainingElements
]
  ? VerifyTuple<
      NextRemainingElements,
      [
        ...ResultElements,
        Exclude<
          keyof CurrentElement,
          keyof ItemConfig<unknown, unknown>
        > extends never
          ? CurrentElement extends {
              itemKey: infer SomeItemKey;
              ItemDisplay: FunctionComponent<
                ItemDisplayProps<infer DefinedItemDisplayConfig>
              >;
              itemDisplayConfig: infer ProvidedItemDisplayConfig;
            }
            ? ItemConfig<
                SomeItemKey,
                DefinedItemDisplayConfig extends ProvidedItemDisplayConfig
                  ? DefinedItemDisplayConfig
                  : `error: SomeItemDisplayConfig extends ProvidedItemDisplayConfig`
              >
            : `error: CurrentElement extends { itemKey: infer SomeItemKey; ItemDisplay: infer SomeItemDisplay; itemDisplayConfig: infer MaybeItemDisplayConfig; }`
          : `error: Exclude<keyof CurrentElement, keyof ItemConfig<unknown, unknown>> extends never`
      ]
    >
  : ResultElements;

interface ItemConfig<ThisItemKey, ThisItemDisplayConfig> {
  itemKey: ThisItemKey;
  itemDisplayConfig: ThisItemDisplayConfig;
  ItemDisplay: FunctionComponent<ItemDisplayProps<ThisItemDisplayConfig>>;
}

interface ItemDisplayProps<ThisItemDisplayConfig> {
  itemDisplayConfig: ThisItemDisplayConfig;
}
