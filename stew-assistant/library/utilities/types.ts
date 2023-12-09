export type irrelevantNever = never;

export type irrelevantUnknown = unknown;

export type irrelevantAny = any;

export type AssertExactKeys<ThisDefinedRecord, ThisProvidedRecord> = Exclude<
  keyof ThisProvidedRecord,
  keyof ThisDefinedRecord
> extends never
  ? true
  : false;

export type AssertUniqueKey<
  TheKeyName extends string,
  CurrentRecord,
  ResultRecords
> = CurrentRecord extends Record<TheKeyName, infer CurrentRecordKey>
  ? IsEmptyTuple<ResultRecords> extends true
    ? true
    : ResultRecords extends Array<Record<TheKeyName, infer SomeResultRecordKey>>
    ? CurrentRecordKey extends SomeResultRecordKey
      ? false
      : true
    : never
  : never;

export type IsEmptyTuple<ResultRecords> = ResultRecords extends []
  ? true
  : false;

export type Narrow<RequirementType, SourceType> =
  SourceType extends RequirementType ? SourceType : never;
