import {
  BasicSelect,
  BasicSelectProps,
  Button,
  CustomAnchorButtonProps,
  Input,
} from "stew/components/mod.ts";
import { useEffect, useMemo } from "../../stew-library/deps/preact/hooks.ts";
import { Zod } from "../../stew-library/deps/zod/mod.ts";
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
                errorMessage: `invalid value: "${someFieldValue}"`,
              };
        },
      },
    ],
    formOnSubmit: ({ formState, formApi }: any) => {
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
        validateField: () => ({ validationStatus: "valid" }),
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
        validateField: () => ({ validationStatus: "valid" }),
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
  const { formState, formApi } = props;
  useEffect(() => {
    if (formState.submitStatus === "validationSuccess") {
      formState.formConfig.formOnSubmit({
        formState,
        formApi,
      });
    }
  }, [formState.submitStatus]);
  return (
    <div className={cssModule.formFooterContainer}>
      <Button
        className={cssModule.submitButton}
        ariaLabel={"todo"}
        ariaDescription={"todo"}
        onSelect={() => {
          formApi.submitForm(validateArtistNameStartForm);
        }}
      >
        next
      </Button>
    </div>
  );
}

async function validateArtistNameStartForm(api: any) {
  const { formState } = api;
  const fieldValidationResults = await Promise.all(
    formState.formConfig.formFields.map((someFieldConfig: any) => {
      const someValidateFieldResult = someFieldConfig.validateField(
        formState.fieldValues[someFieldConfig.fieldKey]
      );
      return someValidateFieldResult instanceof Promise
        ? someValidateFieldResult.then((someFieldValidationResult) => ({
            ...someFieldValidationResult,
            fieldKey: someFieldConfig.fieldKey,
          }))
        : {
            ...someValidateFieldResult,
            fieldKey: someFieldConfig.fieldKey,
          };
    })
  );
  return fieldValidationResults.reduce(
    (nextFieldErrorsResult, someFieldValidationResult) => {
      if (someFieldValidationResult.validationStatus === "error") {
        nextFieldErrorsResult[someFieldValidationResult.fieldKey] =
          someFieldValidationResult.errorMessage;
      }
      return nextFieldErrorsResult;
    },
    {}
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
      <div>{formState.fieldErrors.musicArtistName}</div>
    </div>
  );
}

interface MusicArtistTypeFieldProps {}

function MusicArtistTypeField(props: any) {
  const { formState, formApi, someFieldConfig } = props;
  useFieldEvents({
    formState,
    formApi,
    someFieldConfig,
  });
  return (
    <SelectField
      formState={formState}
      formApi={formApi}
      someFieldConfig={someFieldConfig}
      optionTypeLabel={"music artist name"}
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
    />
  );
}

interface MusicItemTypeFieldProps {}

function MusicItemTypeField(props: any) {
  const { formState, formApi, someFieldConfig } = props;
  useFieldEvents({
    formState,
    formApi,
    someFieldConfig,
  });
  return (
    <SelectField
      formState={formState}
      formApi={formApi}
      someFieldConfig={someFieldConfig}
      optionTypeLabel={"music item type"}
      optionList={[
        {
          optionLabel: "artist",
          optionValue: "artist",
        },
      ]}
    />
  );
}

interface SelectFieldProps
  extends Pick<
    BasicSelectProps<
      { optionLabel: string; optionValue: string },
      "optionLabel",
      CustomAnchorButtonProps
    >,
    "optionTypeLabel" | "optionList"
  > {
  someFieldConfig: any;
  formState: any;
  formApi: any;
}

function SelectField(props: SelectFieldProps) {
  const { formState, someFieldConfig, formApi, optionList, optionTypeLabel } =
    props;
  const { fieldSelectOption, fieldSelectedOption } = useMemo(
    () => ({
      fieldSelectOption: (nextFieldOption: any) => {
        if (
          nextFieldOption.optionValue !==
          formState.fieldValues[someFieldConfig.fieldKey]
        ) {
          formApi.setFieldValue(
            someFieldConfig.fieldKey,
            nextFieldOption.optionValue
          );
        }
      },
      fieldSelectedOption: optionList.find(
        (someFieldOption) =>
          someFieldOption.optionValue ===
          formState.fieldValues[someFieldConfig.fieldKey]
      ) ?? {
        optionLabel: "select item type",
        optionValue: null,
      },
    }),
    [formState.fieldValues[someFieldConfig.fieldKey]]
  );
  return (
    <div className={cssModule.fieldContainer}>
      <BasicSelect
        anchorAriaLabel={`todo`}
        anchorAriaDescription={`todo`}
        optionLabelKey={"optionLabel"}
        optionList={optionList}
        optionTypeLabel={optionTypeLabel}
        selectOption={fieldSelectOption}
        selectedOption={fieldSelectedOption}
      />
    </div>
  );
}

interface UseFieldEventsApi {
  someFieldConfig: any;
  formState: any;
  formApi: any;
}

function useFieldEvents(api: UseFieldEventsApi) {
  const { someFieldConfig, formState, formApi } = api;
  useEffect(() => {
    if (someFieldConfig.fieldOnChange) {
      someFieldConfig.fieldOnChange({
        formState,
        formApi,
      });
    }
  }, [formState.fieldValues[someFieldConfig.fieldKey]]);
}
