import {
  ClientApp,
  ClientAppProps,
  Page,
} from "../../stew-library/components/mod.ts";
import { useMemo, useState } from "stew/deps/preact/hooks.ts";
//
import {
  AssistantFormComponent,
  AssistantFormField,
  BuildAssistantConfig,
} from "../library/AssistantConfig.ts";
// @deno-types="CssModule"

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: BuildAssistantConfig;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { assistantState, assistantApi } = useAssistantApp({ assistantConfig });
  const activeFormState =
    assistantState.formStack[assistantState.formStack.length - 1];
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        <activeFormState.FormComponent
          formFields={activeFormState.formFields}
          formApi={assistantApi.formApi}
        />
      </Page>
    </ClientApp>
  );
}

interface UseAssistantAppApi
  extends Pick<AssitantAppProps, "assistantConfig"> {}

function useAssistantApp(api: UseAssistantAppApi) {
  const { assistantConfig } = api;
  const [assistantState, setAssistantState] = useState<AssistantState>({
    formStack: [
      {
        FormComponent: assistantConfig.assistantEntryFormConfig.FormComponent,
        formFields:
          assistantConfig.assistantEntryFormConfig.getInitialFormFields(),
      },
    ],
  });
  const assistantApi = useMemo(() => {
    return {
      formApi: {
        replaceForm: (
          nextFormKey: string,
          initialFormFields: Record<string, AssistantFormField<any>>
        ) => {
          setAssistantState((currentAssistantState) => {
            const [activeFormState, ...reversedOtherFormStates] = [
              ...currentAssistantState.formStack,
            ].reverse();
            return {
              ...currentAssistantState,
              formStack: [
                ...reversedOtherFormStates.reverse(),
                {
                  FormComponent:
                    assistantConfig.assistantForms[nextFormKey].FormComponent,
                  formFields: initialFormFields,
                },
              ],
            };
          });
        },
        setField: (
          fieldKey: string,
          nextField: AssistantFormField<unknown>
        ) => {
          setAssistantState((currentAssistantState) => {
            const [activeFormState, ...reversedOtherFormStates] = [
              ...currentAssistantState.formStack,
            ].reverse();
            return {
              ...currentAssistantState,
              formStack: [
                ...reversedOtherFormStates.reverse(),
                {
                  ...activeFormState,
                  formFields: {
                    ...activeFormState.formFields,
                    [fieldKey]: nextField,
                  },
                },
              ],
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
  formStack: Array<{
    FormComponent: AssistantFormComponent<
      Record<string, AssistantFormField<unknown>>
    >;
    formFields: Record<string, AssistantFormField<unknown>>;
  }>;
}
