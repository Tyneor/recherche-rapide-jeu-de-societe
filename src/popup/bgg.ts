import { getTagValue, readXmlStream } from "../lib/xml";

const API_BASE_URL = "https://boardgamegeek.com/xmlapi2";

export type Game = {
  link: string;
  name: string;
  thumbnail: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
  playingTime: number;
  minAge: number;

  categories: string[];
  mechanics: string[];
  families: string[];

  publishers: string[];

  ratings: {
    userCount: number;
    average: number;
    geekAverage: number;
    globalRank: number;
    familyRank: number;
    familyRankCategory: number;
  };
};

export const fetchGame = async (id: number): Promise<Game> => {
  const url = API_BASE_URL + "/thing?stats=1&id=" + id;

  const res = await fetch(url);
  console.log(res);
  if (!res.body) throw new Error();
  const xmlDocument = await readXmlStream(res.body);

  return {
    link: "",
    name: "",
    thumbnail: getTagValue(xmlDocument.getElementsByTagName("thumbnail")[0]) ?? "",
    yearPublished: -1,
    minPlayers: -1,
    maxPlayers: -1,
    playingTime: -1,
    minAge: -1,

    categories: [],
    mechanics: [],
    families: [],

    publishers: [],

    ratings: {
      userCount: -1,
      average: -1,
      geekAverage: -1,
      globalRank: -1,
      familyRank: -1,
      familyRankCategory: -1,
    },
  };
};
