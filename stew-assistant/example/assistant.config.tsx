import { useEffect, useMemo } from "../../stew-library/deps/preact/hooks.ts";
import { BasicSelect, Button, Input } from "stew/components/mod.ts";
import { Zod } from "stew/deps/zod/mod.ts";
// @deno-types="CssModule"
import cssModule from "./MusicAssistantConfig.module.scss";

export default {
  assistantForms: [
    itemTypeStartForm(),
    artistTypeStartForm(),
    artistNameStartForm(),
  ],
};

function itemTypeStartForm() {
  return baseStartForm({
    formKey: "itemTypeStartForm",
    formFieldsExtension: [],
    FormFooter: () => null,
    getInitialFieldValues: () => ({
      musicItemType: null,
    }),
  });
}

function artistTypeStartForm() {
  return baseArtistStartForm({
    formKey: "artistTypeStartForm",
    formFieldsExtension: [],
    FormFooter: () => null,
  });
}

function artistNameStartForm() {
  return baseArtistStartForm({
    formKey: "artistNameStartForm",
    FormFooter: ArtistNameStartFormFooter,
    formFieldsExtension: [
      {
        fieldKey: "musicArtistName",
        FieldDisplay: MusicArtistNameField,
        validateField: (someFieldValue: any) => {
          const zodValidationResult = Zod.string()
            .min(1)
            .safeParse(someFieldValue);
          return zodValidationResult.success === true
            ? { validationStatus: "valid" }
            : {
                validationStatus: "error",
                errorMessage: `invalid value: ${someFieldValue}`,
              };
        },
      },
    ],
    formOnValidated: ({ formState, formApi }: any) => {
      console.log(formState.fieldValues);
    },
  });
}

function baseArtistStartForm(formConfig: any) {
  const { formFieldsExtension, ...remainingFormConfig } = formConfig;
  return baseStartForm({
    ...remainingFormConfig,
    formFieldsExtension: [
      {
        fieldKey: "musicArtistType",
        FieldDisplay: MusicArtistTypeField,
        validateField: (someFieldValue: any) => {
          const zodValidationResult = Zod.union([
            Zod.literal("solo"),
            Zod.literal("group"),
          ]).safeParse(someFieldValue);
          return zodValidationResult.success === true
            ? { validationStatus: "valid" }
            : {
                validationStatus: "error",
                errorMessage: `invalid value: ${someFieldValue}`,
              };
        },
        fieldOnChange: ({ formState, formApi }: any) => {
          if (
            formState.fieldValues.musicArtistType === "solo" ||
            formState.fieldValues.musicArtistType === "group"
          ) {
            formApi.replaceForm("artistNameStartForm", {
              ...formState.fieldValues,
              musicArtistName:
                formState.fieldValues["musicArtistName"]?.fieldValue ?? "",
            });
          }
        },
      },
      ...formFieldsExtension,
    ],
  });
}

function baseStartForm(formConfig: any) {
  const { formFieldsExtension, ...remainingFormConfig } = formConfig;
  return {
    ...remainingFormConfig,
    formFields: [
      {
        fieldKey: "musicItemType",
        FieldDisplay: MusicItemTypeField,
        validateField: (someFieldValue: any) => {
          const zodValidationResult = Zod.union([
            Zod.literal("artist"),
            Zod.literal("content"),
          ]).safeParse(someFieldValue);
          return zodValidationResult.success === true
            ? { validationStatus: "valid" }
            : {
                validationStatus: "error",
                errorMessage: `invalid value: ${someFieldValue}`,
              };
        },
        fieldOnChange: ({ formState, formApi }: any) => {
          if (formState.fieldValues.musicItemType === "artist") {
            formApi.replaceForm("artistTypeStartForm", {
              ...formState.fieldValues,
              musicArtistType: null,
            });
          }
        },
      },
      ...formFieldsExtension,
    ],
  };
}

interface ArtistNameStartFormFooterProps {}

function ArtistNameStartFormFooter(props: any) {
  const { formApi, formState } = props;
  return (
    <div className={cssModule.formFooterContainer}>
      <Button
        className={cssModule.submitButton}
        ariaLabel={"todo"}
        ariaDescription={"todo"}
        onSelect={() => {
          formApi.validateForm();
        }}
      >
        next
      </Button>
    </div>
  );
}

interface MusicArtistNameFieldProps {}

function MusicArtistNameField(props: any) {
  const { formState, formApi } = props;
  return (
    <div className={cssModule.fieldContainer}>
      <Input
        placeholder={"music artist name"}
        value={formState.fieldValues.musicArtistName}
        onInput={(someInputEvent: any) => {
          formApi.setFieldValue(
            "musicArtistName",
            someInputEvent.currentTarget.value
          );
        }}
        clearButtonProps={{
          ariaLabel: "todo",
          ariaDescription: "todo",
          onSelect: () => {
            formApi.setFieldValue("musicArtistName", "");
          },
        }}
      />
    </div>
  );
}

interface MusicArtistTypeFieldProps {}

function MusicArtistTypeField(props: any) {
  const { formState, formApi } = props;
  const { artistTypeOptionList, artistTypeSelectOption } = useMemo(
    () => ({
      artistTypeOptionList: [
        {
          optionLabel: "solo",
          optionValue: "solo",
        },
        {
          optionLabel: "group",
          optionValue: "group",
        },
      ],
      artistTypeSelectOption: (nextMusicArtistTypeOption: any) => {
        formApi.setFieldValue(
          "musicArtistType",
          nextMusicArtistTypeOption.optionValue
        );
      },
    }),
    []
  );
  const { artistTypeSelectedOption } = useMemo(
    () => ({
      artistTypeSelectedOption: artistTypeOptionList.find(
        (someArtistTypeOption) =>
          someArtistTypeOption.optionValue ===
          formState.fieldValues.musicArtistType
      ) ?? {
        optionLabel: "select artist type",
        optionValue: null,
      },
    }),
    [formState.fieldValues.musicArtistType]
  );
  return (
    <div className={cssModule.fieldContainer}>
      <BasicSelect
        optionTypeLabel={"music artist type"}
        optionLabelKey={"optionLabel"}
        popoverAriaRole={"listbox"}
        anchorAriaLabel={`todo`}
        anchorAriaDescription={`todo`}
        optionList={artistTypeOptionList}
        selectOption={artistTypeSelectOption}
        selectedOption={artistTypeSelectedOption}
      />
    </div>
  );
}

interface MusicItemTypeFieldProps {}

function MusicItemTypeField(props: any) {
  const { formState, formApi } = props;
  const { itemTypeOptionList } = useMemo(
    () => ({
      itemTypeOptionList: [
        {
          optionLabel: "artist",
          optionValue: "artist",
        },
      ],
    }),
    []
  );
  const { itemTypeSelectOption, itemTypeSelectedOption } = useMemo(
    () => ({
      itemTypeSelectOption: (nextMusicItemTypeOption: any) => {
        if (
          nextMusicItemTypeOption.optionValue !==
          formState.fieldValues.musicItemType
        ) {
          formApi.setFieldValue(
            "musicItemType",
            nextMusicItemTypeOption.optionValue
          );
        }
      },
      itemTypeSelectedOption: itemTypeOptionList.find(
        (someArtistTypeOption) =>
          someArtistTypeOption.optionValue ===
          formState.fieldValues.musicItemType
      ) ?? {
        optionLabel: "select item type",
        optionValue: null,
      },
    }),
    [formState.fieldValues.musicItemType]
  );
  return (
    <div className={cssModule.fieldContainer}>
      <BasicSelect
        optionTypeLabel={"music item type"}
        optionLabelKey={"optionLabel"}
        popoverAriaRole={"listbox"}
        anchorAriaLabel={`todo`}
        anchorAriaDescription={`todo`}
        optionList={itemTypeOptionList}
        selectOption={itemTypeSelectOption}
        selectedOption={itemTypeSelectedOption}
      />
    </div>
  );
}
