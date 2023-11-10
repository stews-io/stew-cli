import {
  ClientApp,
  ClientAppProps,
  Page,
} from "../../stew-library/components/mod.ts";
import { createElement } from "../../stew-library/deps/preact/mod.ts";
import { useAssistantView } from "../library/hooks/useAssistantView.ts";
import {
  BuildAssistantConfig,
  RequiredAssistantViewConfig,
  RequiredViewSectionConfig,
} from "../library/types/AssistantConfig.ts";
// @deno-types="CssModule"
import cssModule from "./AssistantApp.module.scss";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: BuildAssistantConfig<
    string,
    string,
    Record<
      string,
      RequiredAssistantViewConfig<
        string,
        Array<RequiredViewSectionConfig<string>>
      >
    >
  >;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { viewState, viewApi } = useAssistantView({
    assistantConfig,
  });
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        {viewState.viewConfig.viewSections.map((someSectionConfig) =>
          createElement(someSectionConfig.SectionDisplay, {
            viewState,
            viewApi,
            someSectionConfig,
            key: someSectionConfig.sectionKey,
          })
        )}
      </Page>
    </ClientApp>
  );
}

// function AssistantForm(props: any) {
//   const { formState, formApi } = props;
//   return (
//     <div className={cssModule.formContainer}>
//       {formState.formConfig.formFields.map((someFieldConfig: any) =>
//         createElement(someFieldConfig.FieldDisplay, {
//           someFieldConfig,
//           formState,
//           formApi,
//         })
//       )}
//       {createElement(formState.formConfig.FormFooter, {
//         formState,
//         formApi,
//       })}
//     </div>
//   );
// }

// interface UseAssistantAppApi
//   extends Pick<AssitantAppProps, "assistantConfig"> {}

// function useAssistantApp(api: UseAssistantAppApi) {
//   const { assistantConfig } = api;
//   const [assistantState, setAssistantState] = useState<AssistantState>({
//     formState: {
//       submitStatus: "idle",
//       fieldErrors: {},
//       formConfig: assistantConfig.assistantEntryFormConfig,
//       fieldValues:
//         assistantConfig.assistantEntryFormConfig.getInitialFieldValues(),
//     },
//   });
//   const assistantApi = useMemo(() => {
//     return {
//       formApi: {
//         submitForm: (
//           validateForm: (api: {
//             formState: any;
//           }) => Promise<Record<string, string>>
//         ) => {
//           setAssistantState((currentAssistantState) => ({
//             ...currentAssistantState,
//             formState: {
//               ...currentAssistantState.formState,
//               submitStatus: "validationInProgress",
//               submitValidationWorker: validateForm({
//                 formState: currentAssistantState.formState,
//               }).then((nextFieldErrors: Record<string, string>) => {
//                 setAssistantState((currentAssistantState) => ({
//                   ...currentAssistantState,
//                   formState: {
//                     formConfig: currentAssistantState.formState.formConfig,
//                     fieldValues: currentAssistantState.formState.fieldValues,
//                     fieldErrors: nextFieldErrors,
//                     submitStatus: "validationComplete",
//                   },
//                 }));
//               }),
//             },
//           }));
//         },
//         replaceForm: (
//           nextFormKey: string,
//           initialFieldValues: Record<string, any>,
//           initialFieldErrors: Record<string, string> = {}
//         ) => {
//           setAssistantState((currentAssistantState) => ({
//             ...currentAssistantState,
//             formState: {
//               submitStatus: "idle",
//               formConfig: assistantConfig.assistantForms[nextFormKey],
//               fieldValues: initialFieldValues,
//               fieldErrors: initialFieldErrors,
//             },
//           }));
//         },
//         setFieldValue: (fieldKey: string, nextFieldValue: any) => {
//           setAssistantState((currentAssistantState) => {
//             return {
//               ...currentAssistantState,
//               formState: {
//                 ...currentAssistantState.formState,
//                 fieldValues: {
//                   ...currentAssistantState.formState.fieldValues,
//                   [fieldKey]: nextFieldValue,
//                 },
//               },
//             };
//           });
//         },
//         setFieldValues: (someFieldValues: Record<string, any>) => {
//           setAssistantState((currentAssistantState) => {
//             return {
//               ...currentAssistantState,
//               formState: {
//                 ...currentAssistantState.formState,
//                 fieldValues: {
//                   ...currentAssistantState.formState.fieldValues,
//                   ...someFieldValues,
//                 },
//               },
//             };
//           });
//         },
//         setFieldError: (fieldKey: string, nextFieldError: string) => {
//           setAssistantState((currentAssistantState) => {
//             return {
//               ...currentAssistantState,
//               formState: {
//                 ...currentAssistantState.formState,
//                 fieldErrors: {
//                   ...currentAssistantState.formState.fieldErrors,
//                   [fieldKey]: nextFieldError,
//                 },
//               },
//             };
//           });
//         },
//         setFieldErrors: (someFieldErrors: Record<string, string>) => {
//           setAssistantState((currentAssistantState) => {
//             return {
//               ...currentAssistantState,
//               formState: {
//                 ...currentAssistantState.formState,
//                 fieldErrors: {
//                   ...currentAssistantState.formState.fieldErrors,
//                   ...someFieldErrors,
//                 },
//               },
//             };
//           });
//         },
//       },
//     };
//   }, [setAssistantState]);
//   return {
//     assistantState,
//     assistantApi,
//   };
// }

// interface AssistantState {
//   formState: {
//     formConfig: any;
//     fieldValues: Record<string, any>;
//     fieldErrors: Record<string, string>;
//     submitStatus: string;
//     submitValidationWorker?: Promise<void>;
//   };
// }
