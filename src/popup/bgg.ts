import { readXmlStream } from "../lib/xml";

const API_BASE_URL = "https://boardgamegeek.com/xmlapi2";

export type SearchedGame = {
  id: number;
  name: string;
  yearPublished: number;
};

export type Game = SearchedGame & {
  link: string;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
  playingTime: number;
  minAge: number;

  categories: string[];
  mechanics: string[];
  families: string[];

  // publishers: string[];

  ratings: {
    userCount: number;
    average: number;
    geekAverage: number;
    globalRank: number;
    familyRank: number;
    familyRankCategory: string;
  };
};

export const searchGames = async (searchQuery: string): Promise<SearchedGame[]> => {
  const url = `${API_BASE_URL}/search?type=boardgame&query=${searchQuery}`;
  const res = await fetch(url);
  if (!res.body) throw new Error();
  const xmlDocument = await readXmlStream(res.body);
  console.log(xmlDocument);

  const getAttribute = (element: Element, selector: string, attribute = "value") => {
    const value = element.querySelector(selector)?.getAttribute(attribute);
    if (value === null || value === undefined) return "Not found";
    return value;
  };

  return Array.from(xmlDocument.querySelectorAll("item")).map((item) => ({
    id: parseInt(item.getAttribute("id") ?? ""),
    name: getAttribute(item, "name"),
    yearPublished: parseInt(getAttribute(item, "yearpublished")),
  }));
};

export const fetchGames = async (...ids: number[]): Promise<Game[]> => {
  const url = `${API_BASE_URL}/thing?stats=1&id=${ids.join(",")}`;

  const res = await fetch(url);
  if (!res.body) throw new Error();
  const xmlDocument = await readXmlStream(res.body);
  console.log(xmlDocument);

  const getAttribute = (element: Element | Document, selector: string, attribute = "value") => {
    const value = element.querySelector(selector)?.getAttribute(attribute);
    if (value === null || value === undefined) return "Not found";
    return value;
  };

  const getValueList = (element: Element | Document, selector: string) => {
    const isNull = <T>(el: T | null): el is T => el !== null;
    return Array.from(element.querySelectorAll(selector))
      .map((node) => node.getAttribute("value"))
      .filter(isNull);
  };

  return Array.from(xmlDocument.querySelectorAll("item")).map((item) => {
    const id = parseInt(item.getAttribute("id") ?? "");
    return {
      id,
      link: `https://boardgamegeek.com/boardgame/${id}`,
      name: getAttribute(item, "name[type='primary']"),
      thumbnail: item.querySelector("thumbnail")?.textContent ?? "",
      yearPublished: parseInt(getAttribute(item, "yearpublished")),
      minPlayers: parseInt(getAttribute(item, "minplayers")),
      maxPlayers: parseInt(getAttribute(item, "maxplayers")),
      playingTime: parseInt(getAttribute(item, "playingtime")),
      minAge: parseInt(getAttribute(item, "minage")),

      categories: getValueList(item, "link[type='boardgamecategory']"),
      mechanics: getValueList(item, "link[type='boardgamemechanic']"),
      families: getValueList(item, "link[type='boardgamefamily']"),

      ratings: {
        userCount: parseInt(getAttribute(item, "usersrated")),
        average: parseFloat(getAttribute(item, "average")),
        geekAverage: parseFloat(getAttribute(item, "bayesaverage")),
        globalRank: parseInt(getAttribute(item, "rank[type='subtype']")),
        familyRank: parseInt(getAttribute(item, "rank[type='family']")),
        familyRankCategory: getAttribute(item, "rank[type='family']", "friendlyname"),
      },
    };
  });
};
