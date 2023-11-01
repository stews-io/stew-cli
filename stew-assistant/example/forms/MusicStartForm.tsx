import { Button, Input } from "stew/components/mod.ts";
import { useEffect } from "stew/deps/preact/hooks.ts";
import { Zod } from "stew/deps/zod/mod.ts";
import { getCssClass } from "stew/utilities/getCssClass.ts";
import { FieldContainer } from "../../library/components/FieldContainer.tsx";
import { SelectField } from "../../library/components/SelectField.tsx";
import { useFieldEvents } from "../../library/hooks/useFieldEvents.ts";
// @deno-types="CssModule"
import cssModule from "./MusicStartForm.module.scss";

export interface MusicStartFormApi
  extends Pick<BaseStartFormApi, "musicItemTypeFieldOnChange">,
    Pick<BaseArtistStartFormApi, "musicArtistTypeFieldOnChange">,
    Pick<ArtistNameStartFormApi, "artistNameStartFormOnSubmit"> {}

export function musicStartForm(api: MusicStartFormApi) {
  const {
    artistNameStartFormOnSubmit,
    musicItemTypeFieldOnChange,
    musicArtistTypeFieldOnChange,
  } = api;
  return [
    itemTypeStartForm({
      musicItemTypeFieldOnChange,
    }),
    artistTypeStartForm({
      musicItemTypeFieldOnChange,
      musicArtistTypeFieldOnChange,
    }),
    artistNameStartForm({
      musicItemTypeFieldOnChange,
      musicArtistTypeFieldOnChange,
      artistNameStartFormOnSubmit,
    }),
  ];
}

interface ItemTypeStartFormApi
  extends Pick<MusicStartFormApi, "musicItemTypeFieldOnChange"> {}

function itemTypeStartForm(api: ItemTypeStartFormApi) {
  const { musicItemTypeFieldOnChange } = api;
  return baseStartForm({
    musicItemTypeFieldOnChange,
    formConfig: {
      formKey: "itemTypeStartForm",
      formFieldsExtension: [],
      FormFooter: () => null,
      getInitialFieldValues: () => ({
        musicItemType: null,
      }),
    },
  });
}

interface ArtistTypeStartFormApi
  extends Pick<
    MusicStartFormApi,
    "musicItemTypeFieldOnChange" | "musicArtistTypeFieldOnChange"
  > {}

function artistTypeStartForm(api: ArtistTypeStartFormApi) {
  const { musicItemTypeFieldOnChange, musicArtistTypeFieldOnChange } = api;
  return baseArtistStartForm({
    musicItemTypeFieldOnChange,
    musicArtistTypeFieldOnChange,
    formConfig: {
      formKey: "artistTypeStartForm",
      formFieldsExtension: [],
      FormFooter: () => null,
    },
  });
}

interface ArtistNameStartFormApi
  extends Pick<
    BaseArtistStartFormApi,
    "musicItemTypeFieldOnChange" | "musicArtistTypeFieldOnChange"
  > {
  artistNameStartFormOnSubmit: any;
}

function artistNameStartForm(api: ArtistNameStartFormApi) {
  const {
    musicItemTypeFieldOnChange,
    musicArtistTypeFieldOnChange,
    artistNameStartFormOnSubmit,
  } = api;
  return baseArtistStartForm({
    musicItemTypeFieldOnChange,
    musicArtistTypeFieldOnChange,
    formConfig: {
      formKey: "artistNameStartForm",
      FormFooter: ArtistNameStartFormFooter,
      formOnSubmit: artistNameStartFormOnSubmit,
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
        inputContainerClassname={cssModule.fieldInputContainer}
        placeholder={"music artist name"}
        value={formState.fieldValues.musicArtistName}
        onInput={(someInputEvent: any) => {
          formApi.setFieldValue(
            "musicArtistName",
            someInputEvent.currentTarget.value
          );
        }}
        InputDecorator={() => null}
        inputDecoratorProps={{}}
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

interface BaseArtistStartFormApi
  extends Pick<BaseStartFormApi, "formConfig" | "musicItemTypeFieldOnChange"> {
  musicArtistTypeFieldOnChange: any;
}

function baseArtistStartForm(api: BaseArtistStartFormApi) {
  const {
    musicItemTypeFieldOnChange,
    formConfig,
    musicArtistTypeFieldOnChange,
  } = api;
  const { formFieldsExtension, ...remainingFormConfig } = formConfig;
  return baseStartForm({
    musicItemTypeFieldOnChange,
    formConfig: {
      ...remainingFormConfig,
      formFieldsExtension: [
        {
          fieldKey: "musicArtistType",
          FieldDisplay: MusicArtistTypeField,
          validateField: () => ({ validationStatus: "valid" }),
          fieldOnChange: musicArtistTypeFieldOnChange,
        },
        ...formFieldsExtension,
      ],
    },
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
      optionTypeLabel={"music artist type"}
      optionPlaceholder={"select artist type"}
      optionList={MUSIC_ARTIST_TYPE_OPTIONS}
    />
  );
}

const MUSIC_ARTIST_TYPE_OPTIONS = [
  {
    optionLabel: "solo",
    optionValue: "solo",
  },
  {
    optionLabel: "group",
    optionValue: "group",
  },
];

interface BaseStartFormApi {
  formConfig: any;
  musicItemTypeFieldOnChange: any;
}

function baseStartForm(api: BaseStartFormApi) {
  const { formConfig, musicItemTypeFieldOnChange } = api;
  const { formFieldsExtension, ...remainingFormConfig } = formConfig;
  return {
    ...remainingFormConfig,
    formFields: [
      {
        fieldKey: "musicItemType",
        FieldDisplay: MusicItemTypeField,
        validateField: () => ({ validationStatus: "valid" }),
        fieldOnChange: musicItemTypeFieldOnChange,
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
      optionPlaceholder={"select item type"}
      optionList={MUSIC_ITEM_TYPE_OPTIONS}
    />
  );
}

const MUSIC_ITEM_TYPE_OPTIONS = [
  {
    optionLabel: "artist",
    optionValue: "artist",
  },
];
