import { artistDetailsForm } from "./forms/ArtistDetailsForm.tsx";
import { musicStartForm } from "./forms/MusicStartForm.tsx";

export default {
  assistantForms: [
    ...musicStartForm({
      musicItemTypeFieldOnChange: ({ formState, formApi }: any) => {
        if (formState.fieldValues.musicItemType === "artist") {
          formApi.replaceForm("artistTypeStartForm", {
            ...formState.fieldValues,
            musicArtistType: null,
          });
        }
      },
      musicArtistTypeFieldOnChange: ({ formState, formApi }: any) => {
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
      artistNameStartFormOnSubmit: ({ formState, formApi }: any) => {
        if (formState.fieldValues.musicArtistType === "solo") {
          formApi.replaceForm("soloArtistDetailsForm", {
            ...formState.fieldValues,
            musicArtistAlbums: [],
          });
        } else if (formState.fieldValues.musicArtistType === "group") {
          formApi.replaceForm("groupArtistDetailsForm", {
            ...formState.fieldValues,
            musicArtistAlbums: [],
            musicArtistMembers: [],
          });
        }
      },
    }),
    ...artistDetailsForm(),
  ],
};
