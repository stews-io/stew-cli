import { AssistedCompactListField } from "../../library/components/AssistedCompactListField.tsx";
import { ARTIST_DISCOGRAPHY_SYSTEM_PROMPT } from "../utilities/gptPrompts.ts";

export function artistDetailsForm() {
  return [
    {
      formKey: "soloArtistDetailsForm",
      FormFooter: () => null,
      formFields: [
        {
          fieldKey: "musicArtistAlbums",
          FieldDisplay: ArtistAlbumsField,
        },
      ],
    },
    {
      formKey: "groupArtistDetailsForm",
      FormFooter: () => null,
      formFields: [
        {
          fieldKey: "musicArtistAlbums",
          FieldDisplay: ArtistAlbumsField,
        },
      ],
    },
  ];
}

interface ArtistAlbumsFieldProps {}

function ArtistAlbumsField(props: any) {
  const { formState, formApi } = props;
  return (
    <AssistedCompactListField
      fieldLabel={"artist albums"}
      fieldItems={formState.fieldValues.musicArtistAlbums as Array<string>}
      gptSettings={{
        numberOfResults: 2,
        maxTokens: 1024,
        temperature: 2,
        topProbability: 0.1,
        dataItemResultKey: "discographyAlbums",
        systemPrompt: ARTIST_DISCOGRAPHY_SYSTEM_PROMPT,
      }}
      gptUserQueries={[
        `Calculate: ${formState.fieldValues.musicArtistName} Studio, Collaborative, and Compilation Albums`,
        `Calculate: ${formState.fieldValues.musicArtistName} Live Albums`,
      ]}
      setFieldValue={(nextMusicArtistAlbums) => {
        formApi.setFieldValue("musicArtistAlbums", nextMusicArtistAlbums);
      }}
    />
  );
}
