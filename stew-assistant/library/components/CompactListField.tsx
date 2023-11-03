import {
  BadgeList,
  BadgeListItem,
} from "../../../stew-library/components/mod.ts";
import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";
import { throwInvalidPathError } from "../../../stew-library/utilities/throwInvalidPathError.ts";
import { FieldContainer } from "./FieldContainer.tsx";
// @deno-types="CssModule"
import cssModule from "./CompactListField.module.scss";

export interface CompactListFieldProps<
  FieldItem,
  FieldHeaderAddonProps extends Record<string, any>,
  EmptyContentAddonProps extends Record<string, any>
> extends CompactListFieldDataProps<FieldItem>,
    CompactListFieldConfigProps<
      FieldItem,
      FieldHeaderAddonProps,
      EmptyContentAddonProps
    > {}

interface CompactListFieldDataProps<FieldItem> {
  fieldLabel: string;
  fieldItems: Array<FieldItem>;
}

interface CompactListFieldConfigProps<
  FieldItem,
  FieldHeaderAddonProps extends Record<string, any>,
  EmptyContentAddonProps extends Record<string, any>
> {
  FieldHeaderAddon: FunctionComponent<FieldHeaderAddonProps>;
  fieldHeaderAddonProps: FieldHeaderAddonProps;
  FieldItemBadge: FunctionComponent<FieldItemBadgeProps<FieldItem>>;
  EmptyContentAddon: FunctionComponent<EmptyContentAddonProps>;
  emptyContentAddonProps: EmptyContentAddonProps;
  emptyContentMessage: string;
}

export interface FieldItemBadgeProps<FieldItem> {
  someFieldItem: FieldItem;
}

export function CompactListField<
  FieldItem,
  FieldHeaderAddonProps extends Record<string, any>,
  EmptyContentAddonProps extends Record<string, any>
>(
  props: CompactListFieldProps<
    FieldItem,
    FieldHeaderAddonProps,
    EmptyContentAddonProps
  >
) {
  const {
    FieldHeaderAddon,
    fieldHeaderAddonProps,
    EmptyContentAddon,
    emptyContentAddonProps,
    emptyContentMessage,
    fieldLabel,
    FieldItemBadge,
    fieldItems,
  } = props;
  if (fieldItems.length === 0) {
    return (
      <EmptyCompactListField
        FieldHeaderAddon={FieldHeaderAddon}
        fieldHeaderAddonProps={fieldHeaderAddonProps}
        EmptyContentAddon={EmptyContentAddon}
        emptyContentAddonProps={emptyContentAddonProps}
        emptyContentMessage={emptyContentMessage}
        fieldLabel={fieldLabel}
      />
    );
  } else if (fieldItems.length > 0) {
    return (
      <BasicCompactListField
        FieldItemBadge={FieldItemBadge}
        FieldHeaderAddon={FieldHeaderAddon}
        fieldHeaderAddonProps={fieldHeaderAddonProps}
        fieldLabel={fieldLabel}
        fieldItems={fieldItems}
      />
    );
  } else {
    throwInvalidPathError("CompactListField");
  }
}

interface BasicCompactListFieldProps<
  FieldItem,
  FieldHeaderAddonProps extends Record<string, any>
> extends CompactListFieldBaseDataProps<FieldHeaderAddonProps>,
    BasicCompactListFieldContentProps<FieldItem> {}

function BasicCompactListField<
  FieldItem,
  FieldHeaderAddonProps extends Record<string, any>
>(props: BasicCompactListFieldProps<FieldItem, FieldHeaderAddonProps>) {
  const {
    FieldItemBadge,
    fieldItems,
    FieldHeaderAddon,
    fieldHeaderAddonProps,
    fieldLabel,
  } = props;
  return (
    <CompactListFieldBase
      FieldContent={BasicCompactListFieldContent}
      fieldContentProps={{
        FieldItemBadge,
        fieldItems,
      }}
      FieldHeaderAddon={FieldHeaderAddon}
      fieldHeaderAddonProps={fieldHeaderAddonProps}
      fieldLabel={fieldLabel}
    />
  );
}

interface BasicCompactListFieldContentProps<FieldItem>
  extends Pick<
    CompactListFieldProps<
      FieldItem,
      Record<string, unknown>,
      Record<string, unknown>
    >,
    "fieldItems" | "FieldItemBadge"
  > {}

function BasicCompactListFieldContent<FieldItem>(
  props: BasicCompactListFieldContentProps<FieldItem>
) {
  const { fieldItems, FieldItemBadge } = props;
  return (
    <BadgeList ariaLabel="todo">
      {fieldItems.map((someFieldItem) => (
        <BadgeListItem>
          <FieldItemBadge someFieldItem={someFieldItem} />
        </BadgeListItem>
      ))}
    </BadgeList>
  );
}

interface EmptyCompactListFieldProps<
  FieldHeaderAddonProps extends Record<string, any>,
  EmptyContentAddonProps extends Record<string, any>
> extends CompactListFieldBaseDataProps<FieldHeaderAddonProps>,
    EmptyCompactListFieldContentProps<EmptyContentAddonProps> {}

function EmptyCompactListField<
  FieldHeaderAddonProps extends Record<string, any>,
  EmptyContentAddonProps extends Record<string, any>
>(
  props: EmptyCompactListFieldProps<
    FieldHeaderAddonProps,
    EmptyContentAddonProps
  >
) {
  const {
    emptyContentMessage,
    EmptyContentAddon,
    emptyContentAddonProps,
    FieldHeaderAddon,
    fieldHeaderAddonProps,
    fieldLabel,
  } = props;
  return (
    <CompactListFieldBase
      FieldContent={EmptyCompactListFieldContent}
      fieldContentProps={{
        emptyContentMessage,
        EmptyContentAddon,
        emptyContentAddonProps,
      }}
      FieldHeaderAddon={FieldHeaderAddon}
      fieldHeaderAddonProps={fieldHeaderAddonProps}
      fieldLabel={fieldLabel}
    />
  );
}

interface EmptyCompactListFieldContentProps<
  EmptyContentAddonProps extends Record<string, unknown>
> extends Pick<
    CompactListFieldConfigProps<
      unknown,
      Record<string, unknown>,
      EmptyContentAddonProps
    >,
    "emptyContentMessage" | "EmptyContentAddon" | "emptyContentAddonProps"
  > {}

function EmptyCompactListFieldContent<
  EmptyContentAddonProps extends Record<string, unknown>
>(props: EmptyCompactListFieldContentProps<EmptyContentAddonProps>) {
  const { emptyContentMessage, EmptyContentAddon, emptyContentAddonProps } =
    props;
  return (
    <div className={cssModule.emptyContentContainer}>
      <div className={cssModule.emptyContentMessage}>{emptyContentMessage}</div>
      <EmptyContentAddon {...emptyContentAddonProps} />
    </div>
  );
}

interface CompactListFieldBaseProps<
  FieldHeaderAddonProps extends Record<string, any>,
  FieldContentProps extends Record<string, any>
> extends CompactListFieldBaseDataProps<FieldHeaderAddonProps>,
    CompactListFieldBaseConfigProps<FieldContentProps> {}

interface CompactListFieldBaseDataProps<
  FieldHeaderAddonProps extends Record<string, any>
> extends Pick<
    CompactListFieldProps<
      unknown,
      FieldHeaderAddonProps,
      Record<string, unknown>
    >,
    "FieldHeaderAddon" | "fieldHeaderAddonProps" | "fieldLabel"
  > {}

interface CompactListFieldBaseConfigProps<
  FieldContentProps extends Record<string, any>
> {
  FieldContent: FunctionComponent<FieldContentProps>;
  fieldContentProps: FieldContentProps;
}

function CompactListFieldBase<
  FieldHeaderAddonProps extends Record<string, any>,
  FieldContentProps extends Record<string, any>
>(props: CompactListFieldBaseProps<FieldHeaderAddonProps, FieldContentProps>) {
  const {
    fieldLabel,
    FieldHeaderAddon,
    fieldHeaderAddonProps,
    FieldContent,
    fieldContentProps,
  } = props;
  return (
    <FieldContainer>
      <div className={cssModule.fieldHeaderContainer}>
        <div className={cssModule.fieldLabel}>{fieldLabel}</div>
        <FieldHeaderAddon {...fieldHeaderAddonProps} />
      </div>
      <FieldContent {...fieldContentProps} />
    </FieldContainer>
  );
}
