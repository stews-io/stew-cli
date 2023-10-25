import { BasicSelect } from "stew/components/mod.ts";
import { useEffect } from "stew/deps/preact/hooks.ts";
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
      FormComponent: ItemTypeForm,
      getInitialFormFields: (): ItemTypeFormProps["formFields"] => ({
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
      FormComponent: ArtistTypeForm,
    },
  ],
});

// type FormContext = ???

interface ItemTypeFormProps extends AssistantFormProps<ItemTypeFormFields> {}

type ItemTypeFormFields = {
  itemType: FormField<{
    optionLabel: string;
    optionValue: string | null;
  }>;
};

function ItemTypeForm(props: ItemTypeFormProps) {
  const { formFields, formApi } = props;
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
            // {
            //   optionLabel: "select item type",
            //   optionValue: null,
            // },
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
    </div>
  );
}

interface ArtistTypeFormProps
  extends AssistantFormProps<ArtistTypeFormFields> {}

type ArtistTypeFormFields = Merge<
  ItemTypeFormFields,
  {
    artistType: FormField<{
      optionLabel: string;
      optionValue: string;
    }>;
  }
>;

function ArtistTypeForm(props: ArtistTypeFormProps) {
  const { formFields, formApi } = props;
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
            // {
            //   optionLabel: "select item type",
            //   optionValue: null,
            // },
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
      <div className={cssModule.fieldContainer}>
        <BasicSelect
          optionTypeLabel={"item type"}
          optionLabelKey={"optionLabel"}
          popoverAriaRole={"listbox"}
          anchorAriaLabel={`todo`}
          anchorAriaDescription={`todo`}
          optionList={[
            // {
            //   optionLabel: "select artist type",
            //   optionValue: null,
            // },
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
    </div>
  );
}

type Merge<T, V> = T & V;
