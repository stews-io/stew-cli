export const artistTypeSystemPrompt = getGptSystemPrompt({
  queryTypeDefinitions: `
interface GptMusicArtistType {
  // a calculate value where the artist is either a "solo" act, a "group" act, or "notAnArtist"
  artistType: "solo" | "group" | "notAnArtist";
}`,
});

export const ARTIST_DISCOGRAPHY_SYSTEM_PROMPT = getGptSystemPrompt({
  queryTypeDefinitions: `
interface GptDiscographyAlbums {
  // the complete list, with zero omissions, of every album title in the artist's discography
  discographyAlbums: Array<AlbumTitle>;
}

type AlbumTitle = string;

interface GptDiscographyMixtapes {
  // the complete list, with zero omissions, of every mixtape title in the artist's discography
  discographyMixtapes: Array<string>;
}

interface GptDiscographyEps {
  // the complete list, with zero omissions, of every ep title in the artist's discography
  discographyEps: Array<string>;
}

interface GptDiscographySingles {
  // the complete list, with zero omissions, of every single title in the artist's discography
  discographySingles: Array<string>;
}`,
});

export const artistGroupMembersSystemPrompt = getGptSystemPrompt({
  queryTypeDefinitions: `
interface GptMusicGroupMembers {
  // the complete list, with zero omissions, of official group members, past and present
  groupMembers: Array<string>;
}`,
});

interface GetGptSystemPromptApi {
  queryTypeDefinitions: string;
}

function getGptSystemPrompt(api: GetGptSystemPromptApi) {
  const { queryTypeDefinitions } = api;
  return `
the music community considers you the foremost expert on music.

your responses are categorized as complete, comprehensive, exhaustive, accurate, accessible, accountable, calculated, deterministic, semantic, direct, explicit, and forthcoming.

you respond exclusively with valid json.

use the type definitions below when responding and make sure to only include the raw json omitting the "\`\`\`json\`\`\`" markdown

\`\`\`typescript
${queryTypeDefinitions}
\`\`\``;
}
