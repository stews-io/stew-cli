import {
  Button,
  ClientApp,
  ClientAppProps,
  Input,
  Page,
} from "../../stew-library/components/mod.ts";
import {
  StateUpdater,
  useMemo,
  useState,
} from "../../stew-library/deps/preact/hooks.ts";
import { Zod } from "../../stew-library/deps/zod/mod.ts";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import { AsyncValue } from "../library/AsyncValue.ts";
import { musicArtistTypeSystemPrompt } from "../library/gptPrompts.ts";
import { queryGptData } from "../library/queryGptData.ts";
// @deno-types="CssModule"
import cssModule from "./AssistantApp.module.scss";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss } = props;
  const [assistantState, setAssistantState] = useState<AssistantState>({
    artistForm: {
      formType: "newArtistForm",
      artistName: "",
      artistType: {
        valueStatus: "none",
      },
    },
  });
  const ArtistForm = useMemo(
    () =>
      assistantState.artistForm.formType === "newArtistForm"
        ? NewArtistForm
        : assistantState.artistForm.formType === "soloArtistForm"
        ? SoloArtistForm
        : assistantState.artistForm.formType === "groupArtistForm"
        ? GroupArtistForm
        : throwInvalidPathError("ArtistForm"),
    [assistantState]
  );
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        <ArtistForm
          assistantState={assistantState}
          setAssistantState={setAssistantState}
        />
      </Page>
    </ClientApp>
  );
}

type AssistantState =
  | NewArtistAssistantState
  | SoloArtistAssistantState
  | GroupArtistAssistantState;

interface NewArtistAssistantState
  extends AssistantStateBase<NewArtistFormState> {}

interface SoloArtistAssistantState
  extends AssistantStateBase<SoloArtistFormState> {}

interface GroupArtistAssistantState
  extends AssistantStateBase<GroupArtistFormState> {}

interface AssistantStateBase<
  SomeArtistForm extends ArtistFormStateBase<string>
> {
  artistForm: SomeArtistForm;
}

interface NewArtistFormState extends ArtistFormStateBase<"newArtistForm"> {}

interface SoloArtistFormState extends ArtistFormStateBase<"soloArtistForm"> {}

interface GroupArtistFormState extends ArtistFormStateBase<"groupArtistForm"> {}

interface ArtistFormStateBase<FormType extends string> {
  formType: FormType;
  artistName: string;
  artistType: AsyncValue<MusicArtistType>;
}

type MusicArtistType = "solo" | "group";

interface NewArtistFormProps {
  assistantState: NewArtistAssistantState;
  setAssistantState: StateUpdater<AssistantState>;
}

function NewArtistForm(props: NewArtistFormProps) {
  const { assistantState, setAssistantState } = props;
  return (
    <div className={cssModule.formContainer}>
      <div className={cssModule.fieldContainer}>
        <div className={cssModule.fieldInputContainer}>
          <Input
            placeholder={"artist name"}
            value={assistantState.artistForm.artistName}
            onInput={(someInputEvent) => {
              setAssistantState((currentAssistantState) => ({
                ...currentAssistantState,
                artistForm: {
                  ...currentAssistantState.artistForm,
                  formType: "newArtistForm",
                  artistName: someInputEvent.currentTarget.value,
                },
              }));
            }}
            clearButtonProps={{
              ariaLabel: "todo",
              ariaDescription: "todo",
              onSelect: () => {
                setAssistantState((currentAssistantState) => ({
                  ...currentAssistantState,
                  artistForm: {
                    ...currentAssistantState.artistForm,
                    formType: "newArtistForm",
                    artistName: "",
                  },
                }));
              },
            }}
          />
        </div>
      </div>
      <div className={cssModule.formFooterContainer}>
        <Button
          className={cssModule.submitButton}
          ariaLabel={"todo"}
          ariaDescription={"todo"}
          onSelect={() => {
            setAssistantState((currentAssistantState) => ({
              ...currentAssistantState,
              artistForm: {
                ...currentAssistantState.artistForm,
                formType: "newArtistForm",
                artistType: {
                  valueStatus: "loading",
                  valueWorker: loadMusicArtistType({
                    setAssistantState,
                    artistName: currentAssistantState.artistForm.artistName,
                  }),
                },
              },
            }));
          }}
        >
          next
        </Button>
      </div>
    </div>
  );
}

interface SoloArtistFormProps {
  assistantState: AssistantState;
  setAssistantState: StateUpdater<AssistantState>;
}

function SoloArtistForm(props: SoloArtistFormProps) {
  const {} = props;
  return <div className={cssModule.formContainer}>solo todo</div>;
}

interface GroupArtistFormProps {
  assistantState: AssistantState;
  setAssistantState: StateUpdater<AssistantState>;
}

function GroupArtistForm(props: GroupArtistFormProps) {
  const {} = props;
  return <div className={cssModule.formContainer}>group todo</div>;
}

interface LoadMusicArtistTypeApi
  extends Pick<AssistantState["artistForm"], "artistName"> {
  setAssistantState: StateUpdater<AssistantState>;
}

async function loadMusicArtistType(api: LoadMusicArtistTypeApi) {
  const { artistName, setAssistantState } = api;
  try {
    const gptMusicArtistData = await queryGptData({
      numberOfResults: 1,
      maxTokens: 256,
      temperature: 0,
      topProbability: 1,
      dataItemSchema: Zod.object({
        artistType: Zod.union([
          Zod.literal("solo"),
          Zod.literal("group"),
          Zod.literal("notAnArtist"),
        ]),
      }),
      systemPrompt: musicArtistTypeSystemPrompt,
      userQuery: `Calculate: ${artistName}`,
    });
    if (gptMusicArtistData[0].artistType === "solo") {
      setAssistantState((currentAssistantState) => ({
        ...currentAssistantState,
        artistForm: {
          ...currentAssistantState.artistForm,
          formType: "soloArtistForm",
          artistType: {
            valueStatus: "success",
            value: "solo",
          },
        },
      }));
    } else if (gptMusicArtistData[0].artistType === "group") {
      setAssistantState((currentAssistantState) => ({
        ...currentAssistantState,
        artistForm: {
          ...currentAssistantState.artistForm,
          formType: "groupArtistForm",
          artistType: {
            valueStatus: "success",
            value: "group",
          },
        },
      }));
    } else if (gptMusicArtistData[0].artistType === "notAnArtist") {
      setAssistantState((currentAssistantState) => ({
        ...currentAssistantState,
        artistForm: {
          ...currentAssistantState.artistForm,
          formType: "newArtistForm",
          artistType: {
            valueStatus: "error",
          },
        },
      }));
    } else {
      throwInvalidPathError("loadMusicArtistType");
    }
  } catch (someError) {
    console.error(someError);
    setAssistantState((currentAssistantState) => ({
      ...currentAssistantState,
      artistForm: {
        ...currentAssistantState.artistForm,
        formType: "newArtistForm",
        artistType: {
          valueStatus: "error",
        },
      },
    }));
  }
}
