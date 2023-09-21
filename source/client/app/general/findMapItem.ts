export interface FindMapItemApi<
  SomeMap extends Record<string, any>,
  MapItem extends SomeMap[string],
  ItemSearchKey extends keyof MapItem
> {
  someMap: SomeMap;
  itemSearchKey: ItemSearchKey;
  itemTargetValue: MapItem[ItemSearchKey];
}

export function findMapItem<
  SomeMap extends Record<string, any>,
  MapItem extends SomeMap[string],
  ItemSearchKey extends keyof MapItem
>(api: FindMapItemApi<SomeMap, MapItem, ItemSearchKey>): MapItem | undefined {
  const { someMap, itemSearchKey, itemTargetValue } = api;
  return Object.values<MapItem>(someMap).find(
    (someMapItem) => someMapItem[itemSearchKey] === itemTargetValue
  );
}
