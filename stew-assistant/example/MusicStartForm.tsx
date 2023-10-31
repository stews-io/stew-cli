import { Button, Input } from "stew/components/mod.ts";
import { useEffect } from "stew/deps/preact/hooks.ts";
import { Zod } from "stew/deps/zod/mod.ts";
import { getCssClass } from "stew/utilities/getCssClass.ts";
import { FieldContainer, SelectField, useFieldEvents } from "./general.tsx";
// @deno-types="CssModule"
import cssModule from "./MusicStartForm.module.scss";

export function itemTypeStartForm() {
  return baseStartForm({
    formKey: "itemTypeStartForm",
    formFieldsExtension: [],
    FormFooter: () => null,
    getInitialFieldValues: () => ({
      musicItemType: null,
    }),
  });
}

export function artistTypeStartForm() {
  return baseArtistStartForm({
    formKey: "artistTypeStartForm",
    formFieldsExtension: [],
    FormFooter: () => null,
  });
}

export function artistNameStartForm() {
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
      formApi.replaceForm("artistDetailsForm", {});
    },
  });
}

interface ArtistNameStartFormFooterProps {}

function ArtistNameStartFormFooter(props: any) {
  const { formState, formApi } = props;
  useEffect(() => {
    if (
      formState.submitStatus === "validationComplete" &&
      Object.keys(formState.fieldErrors).length === 0
    ) {
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
    <FieldContainer>
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
      <div
        className={getCssClass(cssModule.fieldMessage, [
          cssModule.fieldErrorMessage,
          Boolean(formState.fieldErrors.musicArtistName),
        ])}
      >
        {formState.fieldErrors.musicArtistName ?? ""}
      </div>
    </FieldContainer>
  );
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
