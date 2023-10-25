import { BasicSelect, Input } from "stew/components/mod.ts";
import { useEffect } from "stew/deps/preact/hooks.ts";
import { FunctionComponent, JSX, Fragment } from "stew/deps/preact/mod.ts";
import {
  AssistantFormProps,
  assistantConfig,
} from "../library/AssistantConfig.ts";
import { FormField } from "../library/FormState.ts";
// @deno-types="CssModule"
import cssModule from "./MusicItemTypeForm.module.scss";

export default assistantConfig({
  assistantForms: [
    {
      formKey: "itemType",
      formLabel: "Hip-Hop",
      FormComponent: MusicEntryForm,
      getInitialFormFields: (): MusicEntryFormProps["formFields"] => ({
        itemType: {
          fieldKey: "itemType",
          fieldStatus: "normal",
          fieldValue: {
            optionLabel: "select item type",
            optionValue: null,
          },
        },
      }),
    },
    {
      formKey: "artistType",
      formLabel: "Hip-Hop Artist",
      FormComponent: ArtistTypeEntryForm,
    },
    {
      formKey: "artistName",
      formLabel: "Hip-Hop Artist",
      FormComponent: ArtistNameEntryForm,
    },
  ],
});

interface MusicEntryFormProps extends AssistantFormProps<BaseEntryFormFields> {}

function MusicEntryForm(props: MusicEntryFormProps) {
  const { formApi, formFields } = props;
  return (
    <BaseEntryForm
      formApi={formApi}
      formFields={formFields}
      BaseFormExtension={MusicBaseFormExtension}
      baseFormExtensionProps={{
        formApi,
        formFields,
      }}
    />
  );
}

function MusicBaseFormExtension() {
  return null;
}

interface ArtistTypeEntryFormProps
  extends AssistantFormProps<ArtistTypeFormFields> {}

type ArtistTypeFormFields = BaseArtistEntryFormFields;

function ArtistTypeEntryForm(props: ArtistTypeEntryFormProps) {
  const { formApi, formFields } = props;
  return (
    <BaseArtistEntryForm
      formApi={formApi}
      formFields={formFields}
      ArtistFormExtension={() => null}
      artistFormExtensionProps={{
        formApi,
        formFields,
      }}
    />
  );
}

interface ArtistNameEntryFormProps
  extends Pick<
    BaseArtistEntryFormProps<ArtistNameFormFields, any>,
    "formFields" | "formApi"
  > {}

type ArtistNameFormFields = Merge<
  BaseArtistEntryFormFields,
  {
    artistName: FormField<string>;
  }
>;

function ArtistNameEntryForm(props: ArtistNameEntryFormProps) {
  const { formApi, formFields } = props;
  return (
    <BaseArtistEntryForm
      formApi={formApi}
      formFields={formFields}
      ArtistFormExtension={NameArtistFormExtension}
      artistFormExtensionProps={{
        formApi,
        formFields,
      }}
    />
  );
}

function NameArtistFormExtension(props: any) {
  const { formFields, formApi } = props;
  return (
    <div className={cssModule.fieldContainer}>
      <Input
        placeholder={"artist name"}
        value={formFields.artistName.fieldValue}
        onInput={(someInputEvent) => {
          formApi.setField("artistName", {
            fieldKey: "artistName",
            fieldStatus: "normal",
            fieldValue: someInputEvent.currentTarget.value,
          });
        }}
        clearButtonProps={{
          ariaLabel: "todo",
          ariaDescription: "todo",
          onSelect: () => {
            formApi.setField("artistName", {
              fieldKey: "artistName",
              fieldStatus: "normal",
              fieldValue: "",
            });
          },
        }}
      />
    </div>
  );
}

interface BaseArtistEntryFormProps<
  SomeEntryFormFields extends BaseArtistEntryFormFields,
  ArtistFormExtensionProps extends AssistantFormProps<SomeEntryFormFields>
> extends AssistantFormProps<BaseArtistEntryFormFields> {
  ArtistFormExtension: FunctionComponent<ArtistFormExtensionProps>;
  artistFormExtensionProps: ArtistFormExtensionProps;
}

type BaseArtistEntryFormFields = Merge<
  BaseEntryFormFields,
  {
    artistType: FormField<{
      optionLabel: string;
      optionValue: string;
    }>;
  }
>;

function BaseArtistEntryForm<
  SomeEntryFormFields extends BaseArtistEntryFormFields,
  ArtistFormExtensionProps extends AssistantFormProps<SomeEntryFormFields>
>(
  props: BaseArtistEntryFormProps<SomeEntryFormFields, ArtistFormExtensionProps>
) {
  const { formApi, formFields, ArtistFormExtension, artistFormExtensionProps } =
    props;
  useEffect(() => {
    if (formFields.artistType.fieldValue.optionValue !== null) {
      formApi.replaceForm("artistName", {
        ...formFields,
        artistName: {
          fieldKey: "artistName",
          fieldStatus: "normal",
          fieldValue: "",
        },
      });
    }
  }, [formFields.artistType]);
  return (
    <BaseEntryForm
      formApi={formApi}
      formFields={formFields}
      BaseFormExtension={ArtistBaseFormExtension}
      baseFormExtensionProps={{
        formApi,
        formFields,
        ArtistFormExtension,
        artistFormExtensionProps,
      }}
    />
  );
}

function ArtistBaseFormExtension(props: any) {
  const { formFields, formApi, ArtistFormExtension, artistFormExtensionProps } =
    props;
  return (
    <Fragment>
      <div className={cssModule.fieldContainer}>
        <BasicSelect
          optionTypeLabel={"artist type"}
          optionLabelKey={"optionLabel"}
          popoverAriaRole={"listbox"}
          anchorAriaLabel={`todo`}
          anchorAriaDescription={`todo`}
          optionList={[
            {
              optionLabel: "solo",
              optionValue: "solo",
            },
            {
              optionLabel: "group",
              optionValue: "group",
            },
          ]}
          selectedOption={formFields.artistType.fieldValue}
          selectOption={(nextItemTypeOption) => {
            formApi.setField("artistType", {
              fieldStatus: "normal",
              fieldKey: "artistType",
              fieldValue: nextItemTypeOption,
            });
          }}
        />
      </div>
      <ArtistFormExtension {...artistFormExtensionProps} />
    </Fragment>
  );
}

interface BaseEntryFormProps<
  SomeEntryFormFields extends BaseEntryFormFields,
  BaseFormExtensionProps extends AssistantFormProps<SomeEntryFormFields>
> extends AssistantFormProps<SomeEntryFormFields> {
  BaseFormExtension: FunctionComponent<BaseFormExtensionProps>;
  baseFormExtensionProps: BaseFormExtensionProps;
}

type BaseEntryFormFields = {
  itemType: FormField<{
    optionLabel: string;
    optionValue: string | null;
  }>;
};

function BaseEntryForm<
  SomeEntryFormFields extends BaseEntryFormFields,
  BaseFormExtensionProps extends AssistantFormProps<SomeEntryFormFields>
>(props: BaseEntryFormProps<SomeEntryFormFields, BaseFormExtensionProps>) {
  const { formApi, formFields, BaseFormExtension, baseFormExtensionProps } =
    props;
  useEffect(() => {
    if (formFields.itemType.fieldValue.optionValue === "artist") {
      formApi.replaceForm("artistType", {
        ...formFields,
        artistType: {
          fieldStatus: "normal",
          fieldKey: "artistType",
          fieldValue: {
            optionLabel: "select artist type",
            optionValue: null,
          },
        },
      });
    }
  }, [formFields.itemType]);
  return (
    <div className={cssModule.formContainer}>
      <div className={cssModule.fieldContainer}>
        <BasicSelect
          optionTypeLabel={"item type"}
          optionLabelKey={"optionLabel"}
          popoverAriaRole={"listbox"}
          anchorAriaLabel={`todo`}
          anchorAriaDescription={`todo`}
          optionList={[
            {
              optionLabel: "artist",
              optionValue: "artist",
            },
          ]}
          selectedOption={formFields.itemType.fieldValue}
          selectOption={(nextItemTypeOption) => {
            formApi.setField("itemType", {
              fieldStatus: "normal",
              fieldKey: "itemType",
              fieldValue: nextItemTypeOption,
            });
          }}
        />
      </div>
      <BaseFormExtension {...baseFormExtensionProps} />
    </div>
  );
}

type Merge<T, V> = T & V;
