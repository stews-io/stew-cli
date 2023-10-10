import { SegmentDataset } from "stew/config/mod.ts";
import { MusicItem } from "./MusicItem.ts";
import {
  getAppleLinkData,
  getSpotifyLinkData,
  getYoutubeLinkData,
} from "./getMusicLinkData.ts";

export const musicDataset: SegmentDataset<MusicItem> = [
  {
    itemId: 0,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/41lpwGEQvoL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2018,
    musicTitle: "IC-01 Hanoi",
    musicArtist: ["Unknown Mortal Orchestra"],
    recordingContext: ["studio"],
    musicTags: ["experimental", "jazz", "rock"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=pvkk7REuV1E&list=OLAK5uy_nCjQf37f4TiIDL2budDY-NCgch1gRrPH0&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/1gmj1UwTm2mT6DoS8H4jke?autoplay=true",
      }),
      getAppleLinkData({
        appleHref: "https://music.apple.com/us/album/ic-01-hanoi/1434607269",
      }),
    ],
  },
  {
    itemId: 1,
    musicType: "source",
    sourceType: "collection",
    collectionType: "ep",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/61XiJrQYpuL._UX500_FMwebp_QL85_.jpg",
    musicYear: 1997,
    musicTitle: "Premiers Symptômes",
    musicArtist: ["Air"],
    recordingContext: ["studio"],
    musicTags: ["downtempo", "electronic"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=tl7dASVOY-U&list=OLAK5uy_ly5-qc6sTJFqfArTGCB9HoBaRZFWWpLMM&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/3g9O7pvuaaFRvdzsoSJXVc?autoplay=true",
      }),
      getAppleLinkData({
        appleHref:
          "https://music.apple.com/us/album/premiers-sympt%C3%B4mes-ep/966652812",
      }),
    ],
  },
  {
    itemId: 2,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/51ZKa067uhL._UX500_FMwebp_QL85_.jpg",
    musicTitle: "Live Vol. 1",
    musicYear: 2020,
    musicArtist: ["Parcels"],
    recordingContext: ["live"],
    musicTags: ["disco", "funk", "pop"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=siY7GGocJbY&list=OLAK5uy_lLJK7Z5OSt6XzI7rcgDmeIWpqervk2ycE&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/4ckyPfMqe26PrOgEWdjWns?autoplay=true",
      }),
      getAppleLinkData({
        appleHref: "https://music.apple.com/us/album/live-vol-1/1506250361",
      }),
    ],
  },
  {
    itemId: 3,
    musicType: "source",
    sourceType: "collection",
    collectionType: "compilation",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/41WZvHEcbuL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2006,
    musicTitle: "The Best Of What's Around Vol. 01",
    musicArtist: ["Dave Matthews Band"],
    recordingContext: ["studio", "concert"],
    musicTags: ["jam", "rock"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=wILVn4QrNxU&list=OLAK5uy_mnKHdXzQnlF54alv4i-UTCtpxLc-ujwfo&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/1kae5MA0gbXveSdJDYtFHo?autoplay=true",
      }),
      getAppleLinkData({
        appleHref:
          "https://music.apple.com/us/album/the-best-of-whats-around-vol-1/311604755",
      }),
    ],
  },
  {
    itemId: 4,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/51qCkOpjBYL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2016,
    musicTitle: "Blank Face LP",
    musicArtist: ["ScHoolboy Q"],
    recordingContext: ["studio"],
    musicTags: ["hip-hop", "rap"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=HFfQ5rXZxBI&list=OLAK5uy_nn39BWFdkmInyIa8zuRv16th53bELbtBQ&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/0YbpATCIng8Fz2JrfHmEf7?autoplay=true",
      }),
      getAppleLinkData({
        appleHref: "https://music.apple.com/us/album/blank-face-lp/1440870906",
      }),
    ],
  },
  {
    itemId: 5,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/61LlZokVjxL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2004,
    musicTitle: "Pickin' on Modest Mouse: A Bluegrass Tribute",
    musicArtist: ["Iron Horse", "Modest Mouse"],
    recordingContext: ["studio"],
    musicTags: ["bluegrass"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=Qbmpx8xumlQ&list=OLAK5uy_lR47WSacINRlobDIqT57PVHE-Hp5FKizg&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/3hewWfO0hKXbAFfcsmpYk5?autoplay=true",
      }),
      getAppleLinkData({
        appleHref:
          "https://music.apple.com/us/album/pickin-on-modest-mouse/983448014",
      }),
    ],
  },
  {
    itemId: 6,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/61yiLjG7QQL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2012,
    musicTitle: "Trouble",
    musicArtist: ["Totally Extinct Enormous Dinosaurs"],
    recordingContext: ["studio"],
    musicTags: ["electronic", "pop"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=wG0YCR-3FYY&list=OLAK5uy_n9kdQogDwJvVlB5KLTebiUjyPQ5TXKxGQ&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/1srFzlchwSOzxO8n99tJxP?autoplay=true",
      }),
      getAppleLinkData({
        appleHref: "https://music.apple.com/us/album/trouble/1442636211",
      }),
    ],
  },
  {
    itemId: 7,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/51OoNPSy4IL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2019,
    musicTitle: "Room 41",
    musicArtist: ["Paul Cauthen"],
    recordingContext: ["studio"],
    musicTags: ["country", "rock", "soul"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=xa2uRlL3zhY&list=OLAK5uy_liodoEz6-VjfyY_RJpJgLW2IMA2Eo-nGc&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/4ABV7fsu8iN6eAmnQhvd0a?autoplay=true",
      }),
      getAppleLinkData({
        appleHref: "https://music.apple.com/us/album/room-41/1466095577",
      }),
    ],
  },
  {
    itemId: 8,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/41wnneBCjFL._UX500_FMwebp_QL85_.jpg",
    musicYear: 2022,
    musicTitle: "Organ Recital",
    musicArtist: ["Bastien Keb"],
    recordingContext: ["studio"],
    musicTags: ["r&b", "folk", "soul"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=PKq1UbpkbRQ&list=OLAK5uy_mZIP4yLMAoq7d2wa8NojzttHzBPuV3PY0&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/2CmRxlrIhDSmpM3STHxB5A?autoplay=true",
      }),
      getAppleLinkData({
        appleHref: "https://music.apple.com/us/album/organ-recital/1626095915",
      }),
    ],
  },
  {
    itemId: 9,
    musicType: "source",
    sourceType: "collection",
    collectionType: "album",
    musicThumbnailHref:
      "https://m.media-amazon.com/images/I/61UpX7MWpML._UX500_FMwebp_QL85_.jpg",
    musicYear: 2008,
    musicTitle: "Filling Up the City Skies - Disc 1",
    musicArtist: ["Pretty Lights"],
    recordingContext: ["studio"],
    musicTags: ["downtempo", "hip-hop", "soul"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref:
          "https://www.youtube.com/watch?v=CFe-LdCgy_4&list=OLAK5uy_mQuwlK3nAsIdmW9FCAZe-VHy94NRlzt34&pp=8AUB",
      }),
      getSpotifyLinkData({
        spotifyHref:
          "https://open.spotify.com/album/48DZzoUru3KKjcgZD6ZjTg?autoplay=true",
      }),
      getAppleLinkData({
        appleHref:
          "https://music.apple.com/us/album/filling-up-the-city-skies-vol-1/301057252",
      }),
    ],
  },
  {
    itemId: 10,
    musicType: "source",
    sourceType: "collection",
    collectionType: "ep",
    musicThumbnailHref:
      "https://preview.redd.it/t55x4lyak2y51.jpg?auto=webp&s=6cffa2dd89b7bb9f41a7abe3979ab41f93313c72",
    musicYear: 2012,
    musicTitle: "Bon Iver at AIR studios",
    musicArtist: ["Bon Iver", "Sean Carey"],
    recordingContext: ["live"],
    musicTags: ["folk"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref: "https://youtu.be/A9Tp5fl18Ho",
      }),
    ],
  },
  {
    itemId: 11,
    musicType: "source",
    sourceType: "mix",
    musicThumbnailHref:
      "https://is4-ssl.mzstatic.com/image/thumb/Features125/v4/f4/6b/a9/f46ba999-c102-ea24-7efa-a8e48b43bebd/mza_4437830076440205700.jpg/600x600bb.webp",
    musicYear: 2021,
    musicTitle: "WhoMadeWho",
    musicArtist: ["WhoMadeWho live at Abu Simbel"],
    recordingContext: ["live"],
    musicTags: ["electronic"],
    externalLinks: [
      getYoutubeLinkData({
        youtubeHref: "https://youtu.be/BDwAlto-NKU",
      }),
      getAppleLinkData({
        appleHref:
          "https://music.apple.com/us/album/cercle-whomadewho-in-abu-simbel-egypt-live/1585737974",
      }),
    ],
  },
];
