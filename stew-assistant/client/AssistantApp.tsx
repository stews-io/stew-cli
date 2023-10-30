import {
  ClientApp,
  ClientAppProps,
  Page,
} from "../../stew-library/components/mod.ts";
import {
  useEffect,
  useMemo,
  useState,
} from "../../stew-library/deps/preact/hooks.ts";
import { createElement } from "../../stew-library/deps/preact/mod.ts";
import { throwInvalidPathError } from "stew/utilities/throwInvalidPathError.ts";
// @deno-types="CssModule"
import cssModule from "./AssistantApp.module.scss";
import { underline } from "https://deno.land/std@0.83.0/fmt/colors.ts";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: any;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { assistantState, assistantApi } = useAssistantApp({ assistantConfig });
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        <AssistantForm
          formState={assistantState.formState}
          formApi={assistantApi.formApi}
        />
      </Page>
    </ClientApp>
  );
}

function AssistantForm(props: any) {
  const { formState, formApi } = props;
  return (
    <div className={cssModule.formContainer}>
      {formState.formConfig.formFields.map((someFieldConfig: any) => (
        <AssistantFormField
          key={someFieldConfig.fieldKey}
          someFieldConfig={someFieldConfig}
          formState={formState}
          formApi={formApi}
        />
      ))}
      <AssistantFormFooter formState={formState} formApi={formApi} />
    </div>
  );
}

function AssistantFormField(props: any) {
  const { someFieldConfig, formState, formApi } = props;
  useEffect(() => {
    if (someFieldConfig.fieldOnChange) {
      someFieldConfig.fieldOnChange({
        formApi,
        formState,
      });
    }
  }, [formState.fieldValues[someFieldConfig.fieldKey]]);
  return createElement(someFieldConfig.FieldDisplay, {
    someFieldConfig,
    formState,
    formApi,
  });
}

function AssistantFormFooter(props: any) {
  const { formState, formApi } = props;
  useEffect(() => {
    if (
      formState.formStatus === "validated" &&
      formState.formConfig.formOnValidated
    ) {
      formState.formConfig.formOnValidated({
        formState,
        formApi,
      });
    }
  }, [formState.formStatus]);
  return createElement(formState.formConfig.FormFooter, {
    formState,
    formApi,
  });
}

interface UseAssistantAppApi
  extends Pick<AssitantAppProps, "assistantConfig"> {}

function useAssistantApp(api: UseAssistantAppApi) {
  const { assistantConfig } = api;
  const [assistantState, setAssistantState] = useState<AssistantState>({
    formState: {
      formStatus: "normal",
      formConfig: assistantConfig.assistantEntryFormConfig,
      fieldErrors: {},
      fieldValues:
        assistantConfig.assistantEntryFormConfig.getInitialFieldValues(),
    },
  });
  const assistantApi = useMemo(() => {
    return {
      formApi: {
        validateForm: () => {
          setAssistantState((currentAssistantState) => ({
            ...currentAssistantState,
            formState: {
              ...currentAssistantState.formState,
              formStatus: "validating",
              formValidationWorker: runFormValidationWorker({
                setAssistantState,
                currentAssistantState,
              }),
            },
          }));
        },
        replaceForm: (
          nextFormKey: string,
          initialFieldValues: Record<string, any>,
          initialFieldErrors: Record<string, string> = {}
        ) => {
          setAssistantState((currentAssistantState) => ({
            ...currentAssistantState,
            formState: {
              formStatus: "normal",
              formConfig: assistantConfig.assistantForms[nextFormKey],
              fieldValues: initialFieldValues,
              fieldErrors: initialFieldErrors,
            },
          }));
        },
        setFieldValue: (fieldKey: string, nextFieldValue: any) => {
          setAssistantState((currentAssistantState) => {
            return {
              ...currentAssistantState,
              formState: {
                ...currentAssistantState.formState,
                fieldValues: {
                  ...currentAssistantState.formState.fieldValues,
                  [fieldKey]: nextFieldValue,
                },
              },
            };
          });
        },
      },
    };
  }, [setAssistantState]);
  return {
    assistantState,
    assistantApi,
  };
}

interface AssistantState {
  formState: {
    formStatus: string;
    formConfig: any;
    fieldValues: Record<string, any>;
    fieldErrors: Record<string, string>;
    formValidationWorker?: any;
  };
}

async function runFormValidationWorker(api: any) {
  const { currentAssistantState, setAssistantState } = api;
  const nextFieldErrors =
    currentAssistantState.formState.formConfig.formFields.reduce(
      (result: any, someFieldConfig: any) => {
        const validateFieldResult = someFieldConfig.validateField(
          currentAssistantState.formState.fieldValues[someFieldConfig.fieldKey]
        );
        if (validateFieldResult instanceof Promise) {
          // result[someFieldConfig.fieldKey] = {
          //   validationStatus: "validating",
          //   validationWorker: runFieldValidationWorker({
          //     validateFieldResult
          //   }),
          // };
        } else if (validateFieldResult.validationStatus === "error") {
          result[someFieldConfig.fieldKey] = validateFieldResult;
        }
        return result;
      },
      {}
    );
  await Promise.all(
    Object.values(nextFieldErrors).reduce<any>(
      (result: any, someValidationResult: any) => {
        if (someValidationResult.validationStatus === "validating") {
          result.push(someValidationResult.validationWorker);
        }
        return result;
      },
      []
    )
  );
  setAssistantState((newerCurrentAssistantState: any) => {
    return {
      ...newerCurrentAssistantState,
      formState: {
        ...newerCurrentAssistantState.formState,
        fieldErrors: nextFieldErrors,
        formStatus:
          Object.keys(nextFieldErrors).length === 0
            ? "validated"
            : Object.keys(nextFieldErrors).length > 0
            ? "error"
            : throwInvalidPathError("runFormValidationWorker"),
        formValidationWorker: undefined,
      },
    };
  });
}

async function runFieldValidationWorker(api: any) {
  const {} = api;
}
